"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldPath, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useUpdatePrf } from "@/hooks/prf/useUpdatePrf";
import { PRF_FORM } from "@/interfaces/prf-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SecondarySurveySchema } from "@/interfaces/prf-schema";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
type SecondarySurveyType = z.infer<typeof SecondarySurveySchema>;

type SecondarySurveyFormProps = {
  initialData?: SecondarySurveyType;
};

export default function SecondarySurveyForm({
  initialData,
}: SecondarySurveyFormProps) {
  const prfId = usePathname().split("/")[2];
  const prf_from_store = useStore((state) => state.prfForms).find(
    (prf) => prf.prfFormId == prfId,
  );

  const updatePrfQuery = useUpdatePrf();
  const router = useRouter();
  const { zsEmployee } = useZuStandEmployeeStore();

  const form = useForm<SecondarySurveyType>({
    resolver: zodResolver(SecondarySurveySchema),
    values: prf_from_store?.prfData?.secondary_survey?.data,
    defaultValues: prf_from_store?.prfData?.secondary_survey?.data || {
      scalp: {
        abrasion: false,
        avulsion: false,
        bruising: false,
        burns: false,
        deepWound: false,
        GunShotWound: false,
        PenetratingWound: false,
        oedema: false,
        laceration: false,
        largeWound: false,
        normal: false,
      },
      cranium: {
        BOSFracture: false,
        crepitus: false,
        deformity: false,
        fracture: false,
        GunShotWound: false,
        PenetratingWound: false,
        frontal: false,
        occipital: false,
        parietal: false,
        temporal: false,
        normal: false,
      },
      face: {
        abrasion: false,
        anxious: false,
        bloodInAirway: false,
        bittenTongue: false,
        bruising: false,
        blind: false,
        burns: false,
        crepitus: false,
        crying: false,
        deformity: false,
        deepWound: false,
        epistaxis: false,
        guarding: false,
        GunShotWound: false,
        PenetratingWound: false,
        laceration: false,
        largeWound: false,
        orbitalInjury: false,
        oedema: false,
        normal: false,
      },
      neck: {
        bruising: false,
        burns: false,
        crepitus: false,
        deformity: false,
        guarding: false,
        laceration: false,
        oedema: false,
        penetratingWound: false,
        normal: false,
      },
      spine: {
        bruising: false,
        crepitus: false,
        deformity: false,
        guarding: false,
        GunShotWound: false,
        PenetratingWound: false,
        oedema: false,
        penetratingWound: false,
        sciaticPain: false,
        normal: false,
      },
      chest: {
        abrasion: false,
        asymmetricalRiseAndFall: false,
        bruising: false,
        burns: false,
        crepitus: false,
        deformity: false,
        dyspnoea: false,
        flailSegment: false,
        guardingPalpation: false,
        guardingDepthOfBreathing: false,
        GunShotWound: false,
        PenetratingWound: false,
        laceration: false,
        oedema: false,
        stabWound: false,
        suckingWound: false,
        normal: false,
      },
      abdomen: {
        abrasion: false,
        bruisingEcchymosis: false,
        burns: false,
        distended: false,
        evisceration: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        hernia: false,
        laceration: false,
        reboundTenderness: false,
        rupturedMembranes: false,
        severePain: false,
        stabWound: false,
        uterineContractions: false,
        normalSoftOnPalpation: false,
      },
      pelvis: {
        crepitus: false,
        deformity: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        incontinence: false,
        openWound: false,
        openBook: false,
        severePain: false,
        stable: false,
      },
      leftArm: {
        abrasion: false,
        amputation: false,
        crepitus: false,
        bruising: false,
        deformity: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        laceration: false,
        oedema: false,
        pulse: false,
      },
      rightArm: {
        abrasion: false,
        amputation: false,
        crepitus: false,
        bruising: false,
        deformity: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        laceration: false,
        oedema: false,
        pulse: false,
      },
      leftLeg: {
        abrasion: false,
        amputation: false,
        crepitus: false,
        bruising: false,
        deformity: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        laceration: false,
        oedema: false,
        pulse: false,
      },
      rightLeg: {
        abrasion: false,
        amputation: false,
        crepitus: false,
        bruising: false,
        deformity: false,
        GunShotWound: false,
        PenetratingWound: false,
        guarding: false,
        laceration: false,
        oedema: false,
        pulse: false,
      },
      additionalFindings: "",
    },
  });

  function onSubmit(values: SecondarySurveyType) {
    if (!zsEmployee) {
      toast.error("No Employee Information Found", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }

    if (!form.formState.isDirty) return;

    const prfUpdateValue: PRF_FORM = {
      prfFormId: prfId,
      prfData: {
        ...prf_from_store?.prfData,
        secondary_survey: {
          data: values,
          isCompleted: true,
          isOptional: false,
        },
      },
      EmployeeID: zsEmployee?.employeeNumber.toString() || "",
    };

    updatePrfQuery.mutate(prfUpdateValue, {
      onSuccess: (data) => {
        toast.success("Secondary Survey Updated", {
          duration: 3000,
          position: "top-right",
        });
        router.push(`/edit-prf/${data?.prfFormId}`);
      },
      onError: (error) => {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-right",
        });
      },
    });
  }

  return (
    <Accordion
      type="single"
      defaultValue="scalp"
      collapsible
      className="w-full"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-8"
        >
          <div className="flex items-center justify-between">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Secondary Survey
            </h3>
            <Button
              type="submit"
              disabled={!form.formState.isDirty}
              className="self-end"
            >
              {form.formState.isSubmitting || updatePrfQuery.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
          <AccordionItem value="scalp">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.scalp || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Scalp
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.scalp.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`scalp.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                              console.log(
                                `field.value OLD ${field.value} ** NEW ${!field.value}`,
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cranium">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.cranium || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Cranium
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.cranium.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`cranium.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="face">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.face || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Face
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.face.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`face.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="neck">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.neck || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Neck
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.neck.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`neck.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="spine">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.spine || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Spine
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.spine.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`spine.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="chest">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.chest || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Chest
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.chest.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`chest.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="abdomen">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.abdomen || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Abdomen
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.abdomen.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`abdomen.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="pelvis">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.pelvis || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Pelvis
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.pelvis.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`pelvis.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="leftArm">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.leftArm || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Left Arm
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.leftArm.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`leftArm.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rightArm">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.rightArm || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Right Arm
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.rightArm.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`rightArm.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="leftLeg">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.leftLeg || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Left Leg
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.leftLeg.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`leftLeg.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rightLeg">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.rightLeg || {}).length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Right Leg
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(SecondarySurveySchema.shape.rightLeg.shape).map(
                (key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`rightLeg.${key}` as FieldPath<SecondarySurveyType>}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={() => {
                              field.onChange(!field.value);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal capitalize">
                          {key.split(/(?=[A-Z])/).join(" ")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ),
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="additionalFindings">
            <AccordionTrigger
              className={cn({
                "text-destructive":
                  Object.keys(form.formState.errors.additionalFindings || {})
                    .length > 0,
              })}
            >
              <h4 className="col-span-full scroll-m-20 text-lg font-semibold tracking-tight">
                Additional Findings
              </h4>
            </AccordionTrigger>
            <AccordionContent className="grid gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="additionalFindings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Findings</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe additional findings"
                        {...field}
                        value={field.value as string}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="self-end"
          >
            {form.formState.isSubmitting || updatePrfQuery.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
              </>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </Accordion>
  );
}
