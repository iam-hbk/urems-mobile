// Type definitions for Google Maps JavaScript API
// This file extends the window interface to include the google namespace

import { } from '@types/google.maps';

declare global {
  interface Window {
    google: typeof google;
  }
}

// This empty export is necessary to make this a module
export {}; 