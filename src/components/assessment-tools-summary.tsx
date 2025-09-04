// "use client";

// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";

// import { Stethoscope } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import {
//   RespiratoryDistressType,
//   AssessmentsType,
//   ProceduresType,
// } from "@/interfaces/prf-schema";
// import { PRF_FORM } from "@/interfaces/prf-form";
// type SectionProps<T> = {
//   title: string;
//   data: T | undefined;
//   render: (data: T) => React.ReactNode;
// };

// export default function AssessmentToolsSummary({ prf }: { prf: PRF_FORM }) {
//   // console.log("PRF For Assessment Tools Summary", prf);

//   const sections: Array<
//     | SectionProps<RespiratoryDistressType>
//     | SectionProps<ProceduresType>
//     | SectionProps<AssessmentsType>
//   > = [
//     {
//       title: "Respiratory Distress",
//       data: prf?.prfData?.respiratory_distress?.data as RespiratoryDistressType,
//       render: (data: RespiratoryDistressType) => (
//         <div className="space-y-2">
//           {data.hx.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 History
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.hx.map((item) => (
//                   <Badge key={item} variant="outline">
//                     {item}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.riskFactorsForPulmEmbolus.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Risk Factors for Pulmonary Embolus
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.riskFactorsForPulmEmbolus.map((item) => (
//                   <Badge key={item} variant="outline">
//                     {item}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.additionalFindings.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Additional Findings
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.additionalFindings.map((item) => (
//                   <Badge key={item} variant="outline">
//                     {item}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.infant.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Infant
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.infant.map((item) => (
//                   <Badge key={item} variant="outline">
//                     {item}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Procedures",
//       data: prf?.prfData?.procedures?.data as ProceduresType,
//       render: (data: ProceduresType) => (
//         <div className="space-y-3">
//           {Object.entries(data).map(([category, procedures]) => {
//             if (!procedures || typeof procedures !== "object") return null;

//             const activeProcs = Object.entries(procedures)
//               .filter(([, value]) => {
//                 if (typeof value === "boolean") return value;
//                 if (typeof value === "string") return value.length > 0;
//                 if (typeof value === "number") return true;
//                 return false;
//               })
//               .map(([key, value]) => ({
//                 name: key.replace(/_/g, " "),
//                 value:
//                   typeof value === "string" || typeof value === "number"
//                     ? value.toString()
//                     : undefined,
//               }));

//             if (activeProcs.length === 0) return null;

//             return (
//               <div key={category}>
//                 <h4 className="mb-1 text-sm font-semibold capitalize text-muted-foreground">
//                   {category.replace(/_/g, " ")}
//                 </h4>
//                 <div className="flex flex-wrap gap-1">
//                   {activeProcs.map(({ name, value }) => (
//                     <Badge key={name} variant="outline">
//                       {name}
//                       {value ? `: ${value}` : ""}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ),
//     },
//     {
//       title: "Neuro Assessment",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="space-y-2">
//           {Object.entries(data.neuroAssessment.cincinnatiScale).filter(
//             ([, value]) => value,
//           ).length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Cincinnati Scale
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.neuroAssessment.cincinnatiScale)
//                   .filter(([, value]) => value)
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//               </div>
//             </div>
//           )}
//           {Object.entries(data.neuroAssessment.seizure).filter(
//             ([, value]) => value,
//           ).length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Seizure
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.neuroAssessment.seizure)
//                   .filter(([, value]) => value)
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//               </div>
//             </div>
//           )}
//           {data.neuroAssessment.acuteDelirium && (
//             <div>
//               <Badge variant="outline">Acute Delirium</Badge>
//             </div>
//           )}
//           {data.neuroAssessment.aphasia && (
//             <div>
//               <Badge variant="outline">Aphasia</Badge>
//             </div>
//           )}
//           {(data.neuroAssessment.incontinence.urine ||
//             data.neuroAssessment.incontinence.stool) && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Incontinence
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.neuroAssessment.incontinence.urine && (
//                   <Badge variant="outline">Urine</Badge>
//                 )}
//                 {data.neuroAssessment.incontinence.stool && (
//                   <Badge variant="outline">Stool</Badge>
//                 )}
//               </div>
//             </div>
//           )}
//           {data.neuroAssessment.stupor && (
//             <div>
//               <Badge variant="outline">Stupor</Badge>
//             </div>
//           )}
//           {data.neuroAssessment.syncopeEvents && (
//             <div>
//               <Badge variant="outline">Syncope Events</Badge>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Neuro Conditions",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="flex flex-wrap gap-1">
//           {data.neuroConditions.map((condition) => (
//             <Badge key={condition} variant="outline">
//               {condition}
//             </Badge>
//           ))}
//         </div>
//       ),
//     },
//     {
//       title: "Pain Assessment",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="space-y-2">
//           {Object.entries(data.painAssessment.provocation).filter(
//             ([, v]) => v,
//           ).length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Provocation
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.painAssessment.provocation)
//                   .filter(([, value]) => value)
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//               </div>
//             </div>
//           )}
//           {data.painAssessment.quality.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Quality
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.painAssessment.quality.map((quality) => (
//                   <Badge key={quality} variant="outline">
//                     {quality}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.painAssessment.radiating.yes && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Radiating To
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.painAssessment.radiating)
//                   .filter(([key, value]) => key !== "yes" && value)
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//               </div>
//             </div>
//           )}
//           {data.painAssessment.severity.atOnset && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Severity
//               </h4>
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline">
//                   Onset: {data.painAssessment.severity.atOnset}/10
//                 </Badge>
//                 <span>→</span>
//                 <Badge variant="outline">
//                   Current: {data.painAssessment.severity.current}/10
//                 </Badge>
//               </div>
//             </div>
//           )}
//           {data.painAssessment.timeOfOnset && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Time of Onset
//               </h4>
//               <Badge variant="outline">{data.painAssessment.timeOfOnset}</Badge>
//             </div>
//           )}
//           {data.painAssessment.negativeMurphysSign && (
//             <div>
//               <Badge variant="outline">Negative Murphy&apos;s Sign</Badge>
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Cardiac Risk Factors",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="flex flex-wrap gap-1">
//           {data.cardiacRiskFactors.map((factor) => (
//             <Badge key={factor} variant="outline">
//               {factor}
//             </Badge>
//           ))}
//         </div>
//       ),
//     },
//     {
//       title: "Abdominal Assessment",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="space-y-2">
//           {Object.entries(data.abdominalAssessment.urineOutput).filter(
//             ([key, value]) => value && key !== "uo",
//           ).length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Urine Output
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.abdominalAssessment.urineOutput)
//                   .filter(([key, value]) => value && key !== "uo")
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//                 {data.abdominalAssessment.urineOutput.uo && (
//                   <Badge variant="outline">
//                     Output: {data.abdominalAssessment.urineOutput.uo}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           )}
//           {data.abdominalAssessment.hx.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 History
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.abdominalAssessment.hx.map((item) => (
//                   <Badge key={item} variant="outline">
//                     {item}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.abdominalAssessment.git.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 GIT
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.abdominalAssessment.git.map((symptom) => (
//                   <Badge key={symptom} variant="outline">
//                     {symptom}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {data.abdominalAssessment.pain.length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Pain
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {data.abdominalAssessment.pain.map((pain) => (
//                   <Badge key={pain} variant="outline">
//                     {pain}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           )}
//           {Object.entries(data.abdominalAssessment.contractions).filter(
//             ([key, value]) => value && key !== "amount",
//           ).length > 0 && (
//             <div>
//               <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
//                 Contractions
//               </h4>
//               <div className="flex flex-wrap gap-1">
//                 {Object.entries(data.abdominalAssessment.contractions)
//                   .filter(([key, value]) => value && key !== "amount")
//                   .map(([key]) => (
//                     <Badge key={key} variant="outline">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </Badge>
//                   ))}
//                 {data.abdominalAssessment.contractions.amount && (
//                   <Badge variant="outline">
//                     Amount: {data.abdominalAssessment.contractions.amount}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           )}
//           <div className="flex flex-wrap gap-1">
//             {data.abdominalAssessment.gastroenteritis && (
//               <Badge variant="outline">Gastroenteritis</Badge>
//             )}
//             {data.abdominalAssessment.hematemesis && (
//               <Badge variant="outline">Hematemesis</Badge>
//             )}
//             {data.abdominalAssessment.melaenaStool && (
//               <Badge variant="outline">Melaena Stool</Badge>
//             )}
//             {data.abdominalAssessment.pegTube && (
//               <Badge variant="outline">PEG Tube</Badge>
//             )}
//             {data.abdominalAssessment.diarrhoea && (
//               <Badge variant="outline">Diarrhoea</Badge>
//             )}
//             {data.abdominalAssessment.emesis && (
//               <Badge variant="outline">
//                 Emesis
//                 {data.abdominalAssessment.emesisAmount &&
//                   `: ${data.abdominalAssessment.emesisAmount}`}
//                 {data.abdominalAssessment.emesisDays &&
//                   ` for ${data.abdominalAssessment.emesisDays} days`}
//               </Badge>
//             )}
//           </div>
//           {data.abdominalAssessment.pregnant && (
//             <div className="space-y-1">
//               <Badge variant="outline">Pregnant</Badge>
//               {data.abdominalAssessment.twinPregnancy && (
//                 <Badge variant="outline">Twin Pregnancy</Badge>
//               )}
//               {data.abdominalAssessment.paraGravida && (
//                 <Badge variant="outline">
//                   Para/Gravida: {data.abdominalAssessment.paraGravida}
//                 </Badge>
//               )}
//               {data.abdominalAssessment.gestation && (
//                 <Badge variant="outline">
//                   Gestation: {data.abdominalAssessment.gestation}
//                 </Badge>
//               )}
//             </div>
//           )}
//         </div>
//       ),
//     },
//     {
//       title: "Signs of Dehydration",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="flex flex-wrap gap-1">
//           {data.signsOfDehydration.map((sign) => (
//             <Badge key={sign} variant="outline">
//               {sign}
//             </Badge>
//           ))}
//         </div>
//       ),
//     },
//     {
//       title: "Acute Coronary Syndrome",
//       data: prf?.prfData?.assessments?.data as AssessmentsType,
//       render: (data: AssessmentsType) => (
//         <div className="flex flex-wrap gap-1">
//           {data.signsOfAcuteCoronarySyndrome.map((sign) => (
//             <Badge key={sign} variant="outline">
//               {sign}
//             </Badge>
//           ))}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button
//           variant="default"
//           size="icon"
//           className="fixed bottom-24 right-10 z-50 h-12 w-12 rounded-full shadow-lg"
//         >
//           <Stethoscope className="h-6 w-6" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">
//             Assessment Tools Summary
//           </DialogTitle>
//         </DialogHeader>
//         <ScrollArea className="h-[80vh] pr-4">
//           <div className="grid gap-4">
//             {sections.map((section) => {
//               const dataUnknown = section.data as unknown;
//               const hasData =
//                 dataUnknown &&
//                 (Array.isArray(dataUnknown)
//                   ? dataUnknown.length > 0
//                   : typeof dataUnknown === "object" &&
//                     dataUnknown !== null &&
//                     Object.values(dataUnknown as Record<string, unknown>).some(
//                       (v) =>
//                         v === true ||
//                         (Array.isArray(v) && v.length > 0) ||
//                         (typeof v === "object" &&
//                           v !== null &&
//                           Object.values(v as Record<string, unknown>).some(
//                             (x) => x === true,
//                           )),
//                     ));

//               return (
//                 <Card
//                   key={section.title}
//                   className={`transition-all duration-200 ${hasData ? "border-primary/20" : "border-muted"}`}
//                 >
//                   <CardHeader className="py-3">
//                     <CardTitle className="flex items-center justify-between text-lg">
//                       <span
//                         className={
//                           hasData ? "text-primary" : "text-muted-foreground"
//                         }
//                       >
//                         {section.title}
//                       </span>
//                       {hasData ? (
//                         <Badge variant="default">Completed</Badge>
//                       ) : (
//                         <Badge variant="secondary">Not Started</Badge>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     {hasData ? (
//                       (() => {
//                         switch (section.title) {
//                           case "Respiratory Distress": {
//                             const s = section as SectionProps<RespiratoryDistressType>;
//                             return s.render(s.data as RespiratoryDistressType);
//                           }
//                           case "Procedures": {
//                             const s = section as SectionProps<ProceduresType>;
//                             return s.render(s.data as ProceduresType);
//                           }
//                           default: {
//                             const s = section as SectionProps<AssessmentsType>;
//                             return s.render(s.data as AssessmentsType);
//                           }
//                         }
//                       })()
//                     ) : (
//                       <p className="text-muted-foreground">No data recorded</p>
//                     )}
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
import React from "react";

const AssessmentToolsSummary = () => {
  return <div>AssessmentToolsSummary</div>;
};

export default AssessmentToolsSummary;
