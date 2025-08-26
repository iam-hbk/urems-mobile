/**
 * Examples of how to use the new section wrapper types
 * This file demonstrates the consistent structure across all PRF sections
 */

import { 
  getPrfResponseSectionByName, 
  updatePrfResponse,
  SectionWrapper,
  SectionData,
  CreateSectionData,
  UpdateSectionData,
  SectionName 
} from './prf-api';
import { PatientDetailsSchema } from '@/interfaces/prf-schema';
import { z } from 'zod';

// Example 1: Getting section data with the new wrapper structure
export async function exampleGetSectionData(prfResponseId: string) {
  // All sections now return the same wrapper structure
  const patientDetailsResult = await getPrfResponseSectionByName(prfResponseId, 'patient_details');
  
  if (patientDetailsResult.isOk()) {
    const { data, isCompleted, isOptional } = patientDetailsResult.value;
    
    // data contains the actual patient details schema
    console.log('Patient name:', data.patientName);
    console.log('Section completed:', isCompleted);
    console.log('Section optional:', isOptional);
  }
}

// Example 2: Updating a section with the new wrapper structure
export async function exampleUpdateSection(prfResponseId: string) {
  // When updating, you need to provide the full wrapper structure
  const updateData: SectionWrapper<z.infer<typeof PatientDetailsSchema>> = {
    data: {
      patientName: 'John Doe',
      dateOfBirth: '1990-01-01',
      // ... other patient details
    },
    isCompleted: true,
    isOptional: false
  };
  
  const result = await updatePrfResponse(prfResponseId, 'patient_details', updateData);
  return result;
}

// Example 3: Using utility types for partial updates
export async function examplePartialUpdate(prfResponseId: string) {
  // Use UpdateSectionData for partial updates
  const partialUpdate: UpdateSectionData<'patient_details'> = {
    data: {
      patientName: 'Jane Doe', // Only update the name
      // Other fields remain unchanged
    },
    isCompleted: true // Mark as completed
    // isOptional not specified, so it remains unchanged
  };
  
  // Note: You'll need to get the current data first, then merge
  const currentResult = await getPrfResponseSectionByName(prfResponseId, 'patient_details');
  if (currentResult.isOk()) {
    const current = currentResult.value;
    const updatedData: SectionWrapper<z.infer<typeof PatientDetailsSchema>> = {
      data: { ...current.data, ...partialUpdate.data },
      isCompleted: partialUpdate.isCompleted ?? current.isCompleted,
      isOptional: partialUpdate.isOptional ?? current.isOptional
    };
    
    return await updatePrfResponse(prfResponseId, 'patient_details', updatedData);
  }
}

// Example 4: Type-safe section data extraction
export function exampleTypeSafeData<T extends SectionName>(
  sectionName: T,
  sectionWrapper: SectionWrapper<any>
): SectionData<T> {
  // This function demonstrates how to work with the generic wrapper
  return sectionWrapper.data as SectionData<T>;
}

// Example 5: Creating new section data
export function exampleCreateSectionData(): CreateSectionData<'patient_details'> {
  // This type represents just the data portion without the wrapper
  return {
    patientName: 'New Patient',
    dateOfBirth: '2000-01-01',
    // ... other required fields
  };
}

// Example 6: Working with section status
export function exampleSectionStatus(sectionWrapper: SectionWrapper<any>) {
  // Extract just the status information
  const { isCompleted, isOptional } = sectionWrapper;
  
  if (isCompleted) {
    console.log('Section is complete');
  }
  
  if (isOptional) {
    console.log('Section is optional');
  }
}
