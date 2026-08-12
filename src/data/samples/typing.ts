import type { TypingSample } from '../../lib/types'

const t = (
  id: string,
  title: string,
  domain: TypingSample['domain'],
  difficulty: TypingSample['difficulty'],
  text: string,
): TypingSample => ({ id, kind: 'typing', skill: 'typing', title, domain, difficulty, text })

export const TYPING_SAMPLES: TypingSample[] = [
  // ---- General ----
  t(
    'typ-01',
    'Steady hands',
    'general',
    'beginner',
    'The first rule of clean copy is simple: slow is smooth, and smooth is fast. Settle your wrists, find the home row, and let the words arrive one at a time. Speed is a byproduct of calm. Accuracy is a habit you practice until it stops feeling like effort.',
  ),
  t(
    'typ-02',
    'Shop notice',
    'general',
    'beginner',
    'Our seasonal hours change next Monday. We will open at seven in the morning and close at six in the evening. Weekend hours stay the same. If you ordered beans this week, your bag will be ready at the counter by Friday afternoon. Thanks for supporting a small shop.',
  ),
  t(
    'typ-03',
    'Meeting recap',
    'general',
    'intermediate',
    "Quick recap from Tuesday's planning call. We agreed to ship the pilot on March 3, pending sign-off from finance. Dana owns the vendor checklist, and Priya will draft the rollout note by Friday. Two open questions remain: whether support can staff weekends, and who approves refunds over $250. If anything here looks wrong, reply by end of day Thursday.",
  ),
  t(
    'typ-04',
    'Product changelog',
    'general',
    'intermediate',
    'Version 2.4 ships with three changes. Search results now load in under a second for most queries. Draft documents save automatically every thirty seconds, so a dropped connection no longer costs you work. Finally, we fixed a bug where exported files kept the wrong time zone. Update from the settings page; the download is about forty megabytes.',
  ),
  t(
    'typ-05',
    'Style guide excerpt',
    'general',
    'advanced',
    'Headlines take sentence case, never title case; the only exceptions are proper nouns and product names. Numbers one through nine are spelled out, while 10 and above stay numerals, unless they begin a sentence, in which case rewrite the sentence. Abbreviations such as e.g., i.e., and etc. belong in parentheses, not in running text. When in doubt, choose the shorter word, the shorter sentence, and the plainer construction. Clarity outranks cleverness; consistency outranks both.',
  ),
  t(
    'typ-06',
    'Incident postmortem',
    'general',
    'advanced',
    'At 14:07 UTC on May 9, the API began returning 503 errors for roughly 12% of requests. The proximate cause was a configuration push that lowered the connection pool from 512 to 64; the deeper cause was a review process that let a one-line change skip load testing. Mitigation took 19 minutes: we rolled back the config, drained the affected nodes, and replayed the failed queue. Action items, owners, and deadlines are listed below; please read them before Thursday.',
  ),

  // ---- Medical ----
  t(
    'typ-07',
    'Front desk note',
    'medical',
    'beginner',
    'A patient called this morning to move her checkup from Tuesday to Thursday. She also asked whether the clinic offers flu shots without an appointment. I told her walk-ins are welcome after two in the afternoon. Please update the schedule and leave a note for the nurse.',
  ),
  t(
    'typ-08',
    'Aftercare basics',
    'medical',
    'beginner',
    'Keep the bandage clean and dry for two days. You may shower on the third day, but do not soak the wound. Take the pain medicine with food, and stop if you notice a rash. Call the office if you have a fever or if the redness spreads past the marked line.',
  ),
  t(
    'typ-09',
    'Visit summary',
    'medical',
    'intermediate',
    'Ms. Alvarez came in for a follow-up on her blood pressure. Home readings average 138 over 86, down from last month. She reports mild headaches in the morning but no dizziness or chest pain. We discussed cutting back on salt and walking twenty minutes a day. Refill sent to her pharmacy; recheck in six weeks with a repeat metabolic panel if readings climb.',
  ),
  t(
    'typ-10',
    'Nurse handoff',
    'medical',
    'intermediate',
    'Bed four is a 62-year-old admitted overnight for dehydration after two days of vomiting. He has received two liters of fluids and is keeping water down since noon. Blood work this morning looked better, though his potassium is still low; the replacement dose is running now. He is anxious about his dog at home, so expect questions. His daughter is the contact and has been called.',
  ),
  t(
    'typ-11',
    'Discharge medications',
    'medical',
    'advanced',
    'Discharge medications are as follows: metoprolol 25 mg twice daily; lisinopril 10 mg each morning; atorvastatin 40 mg at bedtime; and aspirin 81 mg daily with food. Hold the metoprolol if the resting heart rate falls below 55 or systolic pressure below 100, and call the cardiology clinic the same day. Avoid ibuprofen and other NSAIDs while on aspirin. The follow-up echocardiogram is scheduled for June 12 at 9:40 a.m.; arrive fasting, water only.',
  ),
  t(
    'typ-12',
    'Operative note excerpt',
    'medical',
    'advanced',
    'The patient tolerated the procedure well. Estimated blood loss was 30 mL; no transfusion was required. The gallbladder was dissected free of the liver bed using electrocautery, placed in a retrieval bag, and removed through the umbilical port. Hemostasis was confirmed, the ports were closed with absorbable suture, and local anesthetic was infiltrated at each site. The patient was extubated in the operating room and transferred to recovery in stable condition. Pathology is pending and will be reviewed at the postoperative visit.',
  ),

  // ---- Legal ----
  t(
    'typ-13',
    'Office voicemail script',
    'legal',
    'beginner',
    'You have reached the law office of Reyes and Park. Our hours are nine to five, Monday through Friday. If you are calling about an existing case, leave your file number and a brief message. For new matters, press two to reach the intake line. Thank you for calling.',
  ),
  t(
    'typ-14',
    'Lease reminder',
    'legal',
    'beginner',
    'This is a reminder that your lease ends on August 31. If you plan to renew, sign and return the enclosed form within thirty days. If you plan to move out, schedule a walkthrough at least one week before your last day. Your deposit will be returned within three weeks, minus any documented repairs.',
  ),
  t(
    'typ-15',
    'Demand letter',
    'legal',
    'intermediate',
    'This letter concerns the unpaid invoice dated April 4 in the amount of $6,180. Despite two written reminders, payment has not been received. Unless full payment arrives within fourteen days of the date above, our client will pursue all available remedies, including interest and collection costs as provided in section 9 of the agreement. Please direct any response to this office in writing.',
  ),
  t(
    'typ-16',
    'Deposition scheduling',
    'legal',
    'intermediate',
    "Counsel have agreed to depose the witness on October 14 at ten in the morning, at the court reporter's office on Fifth Avenue. Each side reserves four hours on the record. Exhibits should be exchanged no later than three business days in advance. If the witness requires an interpreter, notice must be given by the end of this week.",
  ),
  t(
    'typ-17',
    'Force majeure clause',
    'legal',
    'advanced',
    'Neither party shall be liable for any failure or delay in performance to the extent caused by events beyond its reasonable control, including acts of God, labor disputes, utility failures, or governmental action; provided, however, that the affected party gives written notice within ten business days and uses commercially reasonable efforts to resume performance. This section does not excuse any obligation to pay amounts already due, nor shall it extend the term of this agreement except as expressly stated herein.',
  ),
  t(
    'typ-18',
    'Court order excerpt',
    'legal',
    'advanced',
    "Upon consideration of the parties' cross-motions, the court grants the motion to compel in part. Defendant shall produce the requested maintenance logs for the period January 1, 2022, through June 30, 2023, within twenty-one days. The request for sanctions is denied without prejudice; plaintiff may renew it if production is untimely or incomplete. Each party shall bear its own costs. The pretrial conference remains set for November 3 at 2:00 p.m. in Courtroom 6B.",
  ),

  // ---- Medical scribe ----
  t("typ-19", "Rooming Note: Cough", 'medical', "beginner", "Patient roomed at 9:15 for a cough lasting one week. Blood pressure 122/78, pulse 74, temperature 98.6 F. Weight 168 pounds. She reports no fever at home and no chest pain. Medication list reviewed with no changes. Flu shot given last month. Allergies confirmed, none known. Ready for provider in room 4."),
  t("typ-20", "AVS: Ear Infection", 'medical', "beginner", "You were seen today for an ear infection. Take the antibiotic twice a day for ten days, even if you feel better sooner. Use warm compresses for pain as needed. Drink plenty of fluids and rest. Call the office if the fever returns or the pain gets worse. Follow up in two weeks."),
  t("typ-21", "HPI: Epigastric Pain", 'medical', "intermediate", "Mr. Delgado is a 58-year-old male presenting with three days of intermittent epigastric pain. The pain is burning, rated 5 out of 10, worse after meals and when lying flat. He has tried over-the-counter antacids with partial relief. He denies vomiting, black stools, or weight loss. He takes ibuprofen 400 mg most days for knee pain. No prior history of ulcers. Symptoms are similar to an episode two years ago."),
  t("typ-22", "Exam: Right Ear Erythema", 'medical', "intermediate", "General: alert, well appearing, in no acute distress. HEENT: oropharynx clear, mild erythema of the right tympanic membrane. Neck: supple, no lymphadenopathy. Lungs: clear to auscultation bilaterally, no wheezes or crackles. Heart: regular rate and rhythm, no murmurs. Abdomen: soft, nontender, normal bowel sounds. Extremities: no edema, pulses intact. Skin: warm and dry without rash. Neuro: grossly intact, moving all extremities."),
  t("typ-23", "A&P: Diabetes and Hypertension", 'medical', "advanced", "Assessment and plan: 1. Type 2 diabetes, poorly controlled, A1c 9.2 percent. Increase metformin to 1000 mg twice daily and start empagliflozin 10 mg each morning. Recheck A1c and basic metabolic panel in three months. 2. Hypertension, above goal at 152/94. Increase lisinopril from 10 mg to 20 mg daily; continue home log. 3. Hyperlipidemia. Continue atorvastatin 40 mg nightly; lipid panel due at next visit. 4. Health maintenance: diabetic eye exam referral placed, influenza vaccine administered today. Return in twelve weeks or sooner for concerns."),
  t("typ-24", "ED Course: Renal Colic", 'medical', "advanced", "Patient arrived at 14:32 with acute onset left flank pain radiating to the groin. Initial vitals: BP 148/92, HR 104, RR 18, SpO2 98 percent on room air, temp 98.9 F. At 14:50 received ondansetron 4 mg IV and ketorolac 30 mg IV with pain improving from 8/10 to 3/10 by 15:20. CT abdomen and pelvis at 15:45 showed a 4 mm distal left ureteral stone without hydronephrosis. Repeat vitals at 16:30: BP 132/84, HR 82. Discharged at 17:05 with tamsulosin 0.4 mg nightly, strainer, and urology follow up within one week."),
]
