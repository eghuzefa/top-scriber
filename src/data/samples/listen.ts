import type { TranscribeSample } from '../../lib/types'

const l = (
  id: string,
  title: string,
  domain: TranscribeSample['domain'],
  difficulty: TranscribeSample['difficulty'],
  transcript: string,
): TranscribeSample => ({
  id,
  kind: 'transcribe',
  skill: 'listen',
  title,
  domain,
  difficulty,
  transcript,
})

export const LISTEN_SAMPLES: TranscribeSample[] = [
  // ---- Medical ----
  l(
    'lis-01',
    'Appointment confirmation',
    'medical',
    'beginner',
    "Hi, this is Maria from Dr. Chen's office, calling to confirm your appointment tomorrow at nine thirty. Please arrive ten minutes early and bring your insurance card and a list of any medicines you take. If you need to reschedule, just call us back at this number.",
  ),
  l(
    'lis-02',
    'Pharmacy pickup',
    'medical',
    'beginner',
    "Your prescription is ready for pickup. The pharmacist wants a quick word about the new dose, so please come to the counter, not the drive-through. We're open until eight tonight. If you have questions about side effects, we can go over them then.",
  ),
  l(
    'lis-03',
    'Annual physical reminder',
    'medical',
    'beginner',
    'This is a reminder from Lakeside Clinic. You are due for your annual physical, and we have openings next week on Tuesday and Friday mornings. Fasting is required for the blood work, so schedule early in the day if you can. Call us back to pick a time.',
  ),
  l(
    'lis-04',
    'Dictation: visit note',
    'medical',
    'intermediate',
    "Patient is a 45-year-old man here for a persistent dry cough, going on four weeks. No fever, no weight loss, no night sweats. He started a new blood pressure medicine in early spring, and the timing fits. Lungs are clear on exam. Plan: switch off the ACE inhibitor, hold antibiotics, and recheck in three weeks if the cough hasn't settled.",
  ),
  l(
    'lis-05',
    'Radiology callback',
    'medical',
    'intermediate',
    "Calling about the chest X-ray from this morning. The good news: no pneumonia and no fluid. There is a small area at the right base we'd like to watch, most likely scarring from an old infection. We recommend a repeat film in eight weeks to confirm it is stable. The full report will be in the portal tonight.",
  ),
  l(
    'lis-06',
    'Physical therapy intake',
    'medical',
    'intermediate',
    'New referral for the left knee, six weeks after a meniscus repair. The surgeon cleared him for weight bearing as tolerated, no deep squats until week eight. Main complaints are stiffness in the morning and swelling after stairs. Goals are walking two miles and returning to recreational tennis by fall. Twice a week for four weeks, then reassess.',
  ),
  l(
    'lis-07',
    'Emergency room handoff',
    'medical',
    'advanced',
    "Handing off room eleven: 58-year-old woman, chest pressure since about seven this evening, worse with exertion, some radiation to the left jaw. First troponin drawn at nine ten was borderline; the repeat is cooking now. EKG shows nonspecific changes, nothing that meets criteria yet. She's had aspirin, 324 milligrams, and her pressure is holding at 132 over 78. Cardiology is aware. If the repeat comes back elevated, she goes to the cath lab, so keep her fasting.",
  ),
  l(
    'lis-08',
    'Dictation: assessment and plan',
    'medical',
    'advanced',
    'Assessment: type 2 diabetes, poorly controlled, with an A1C of 9.2, up from 8.1 in January. Contributing factors include a stalled exercise routine and irregular meals during night shifts. Plan: start metformin extended release, 500 milligrams with dinner for one week, then increase to 1,000. Continue lisinopril unchanged. Referral to nutrition, with emphasis on shift-worker meal timing. Repeat the A1C and a basic metabolic panel in three months. Return sooner for fasting sugars above 250.',
  ),

  // ---- Legal ----
  l(
    'lis-09',
    'Reception message',
    'legal',
    'beginner',
    "Good afternoon, you've reached Hollis and Grant. Attorney Grant is in a hearing until three. Can I take your name, your callback number, and the matter this is regarding? If it's about the closing on Elm Street, the documents went out this morning.",
  ),
  l(
    'lis-10',
    'Client callback',
    'legal',
    'beginner',
    "Hi, it's Sam from the firm, returning your call about the settlement paperwork. Everything is ready for your signature. You can come in any weekday between nine and four, or we can mail the packet with a prepaid return envelope. Bring photo identification if you come in.",
  ),
  l(
    'lis-11',
    'Hearing reminder',
    'legal',
    'beginner',
    'This message is to remind you that your hearing is set for Monday the eighteenth at nine in the morning, courtroom four. Plan to arrive thirty minutes early to clear security. Dress is business casual or better. If you cannot attend, call the office today, not Monday.',
  ),
  l(
    'lis-12',
    'Attorney voicemail',
    'legal',
    'intermediate',
    "It's Dana Reyes calling about the Whitfield matter. Opposing counsel has offered forty-two five to settle, inclusive of costs. My read is that's their floor before mediation, not their ceiling. We have until Friday close of business to respond. Call me tomorrow morning and we'll talk through whether to counter at fifty-five or let it ride to mediation.",
  ),
  l(
    'lis-13',
    'Paralegal instructions',
    'legal',
    'intermediate',
    "Before you leave today, three things on the Merritt file. First, calendar the discovery deadline: responses are due the twenty-second, so drafts to me by the fifteenth. Second, request certified copies of the police report; the original went missing from the box. Third, the client's new employer address needs to go into the contact sheet. Thanks.",
  ),
  l(
    'lis-14',
    'Clerk recording',
    'legal',
    'intermediate',
    "You've reached the civil clerk's office. Filings received after four thirty are stamped the next business day. Proposed orders must include a self-addressed envelope or a valid email for service. Fee waivers are reviewed within five days. For tomorrow's calendar, check the posted list outside courtroom two or the county website after six tonight.",
  ),
  l(
    'lis-15',
    'Deposition housekeeping',
    'legal',
    'advanced',
    "Counsel, before we go back on the record, two housekeeping items. The witness has agreed to produce the maintenance logs referenced this morning, we'll say within ten business days, subject to the protective order. And we're designating pages forty-one through fifty-eight of the transcript confidential pending review. If you disagree, note it now or raise it by letter within the week. Otherwise, back on the record at one fifteen, and I'll finish with this witness by three.",
  ),
  l(
    'lis-16',
    'Closing argument excerpt',
    'legal',
    'advanced',
    'The defense wants you to believe this was a paperwork error, a misplaced decimal, an innocent slip. But you saw the emails. Three separate warnings, three months apart, each one flagged and each one dismissed by the same manager. That is not an accident; that is a choice, repeated. The law calls it negligence when a company ignores a risk it knows about. Ladies and gentlemen, hold them to the standard their own safety manual sets.',
  ),

  // ---- General ----
  l(
    'lis-17',
    'Team standup',
    'general',
    'beginner',
    "Quick update from me. Yesterday I finished the onboarding checklist and sent it to design for review. Today I'm pairing with Ana on the billing bug, and I'll draft the release notes after lunch. No blockers, but I'll be out Friday afternoon.",
  ),
  l(
    'lis-18',
    'Contractor voicemail',
    'general',
    'beginner',
    "Hey, it's Marcus about the kitchen estimate. Good news, the cabinets came in under budget, but the countertop slab you liked is back-ordered six weeks. There's a similar one in stock I think you'd like. Call me back and I can send photos, or we can meet Thursday.",
  ),
  l(
    'lis-19',
    'Support call summary',
    'general',
    'intermediate',
    'Summary of the call with account 4471. The customer reported duplicate charges on the June invoice, one for $89 and one for $94. I confirmed the second charge was a failed retry that posted anyway, issued a refund, reference number 88213, and waived the late fee as a courtesy. Customer satisfied, no escalation needed. Flagging the retry bug for billing engineering.',
  ),
  l(
    'lis-20',
    'Podcast intro',
    'general',
    'intermediate',
    'Welcome back to the show. Today\'s guest spent eleven years as a court reporter before switching to medical scribing, and she has strong opinions about which is harder. We talk about keeping up with fast talkers, the myth of the perfect transcript, and why she still practices drills every morning. Stick around after for listener questions.',
  ),
  l(
    'lis-21',
    'Earnings call excerpt',
    'general',
    'advanced',
    "Turning to the quarter. Revenue came in at $48.3 million, up 11% year over year, driven mainly by the enterprise tier. Gross margin held at 72%, despite the data center migration we flagged in March. Churn ticked up twenty basis points, concentrated in monthly plans, and we're watching it closely. For the full year, we are raising guidance to a range of $196 to $199 million.",
  ),
  l(
    'lis-22',
    'Conference Q&A',
    'general',
    'advanced',
    "Great question, and it's one we get a lot. The honest answer is that automation didn't reduce our transcription team, it changed what they do. The software produces a rough draft in seconds, but rough is the operative word. Our people now spend their time on speaker attribution, terminology, and the judgment calls a model still gets wrong. Throughput tripled; headcount stayed flat; error rates, and this is the part that matters, fell by half.",
  ),

  // ---- Medical scribe ----
  l("lis-23", "Rooming Vitals Readout", 'medical', "beginner", "Rooming vitals for the two o'clock patient. BP of 118 over 74, heart rate of 68, temp 98.2, respiratory rate of 16, oxygen saturation 99 percent on room air. Weight is 162 pounds, height five foot six. Patient reports no pain today. States she is here for a routine follow up."),
  l("lis-24", "Suture Care Discharge", 'medical', "beginner", "Okay, you are good to go home today. Keep the bandage clean and dry for two days. You can shower after that, but no swimming for a week. Take Tylenol if it hurts. Come back if you notice redness, swelling, or fever. Otherwise we will see you in ten days to remove the stitches."),
  l("lis-25", "Chest Tightness HPI", 'medical', "intermediate", "Patient is a 62-year-old woman presenting with three days of intermittent chest tightness. It comes on with exertion, lasts about five minutes, and resolves with rest. She denies shortness of breath, palpitations, nausea, or diaphoresis. No prior cardiac history. She has hypertension and takes lisinopril 20 mg daily. No recent travel, no leg swelling. Family history is notable for her father with a heart attack at age 58."),
  l("lis-26", "Head to Toe Exam", 'medical', "intermediate", "On exam, patient is alert and in no acute distress. HEENT, pupils equal and reactive, oropharynx clear. Neck is supple without lymphadenopathy. Lungs are clear to auscultation bilaterally, no wheezes or crackles. Heart has a regular rate and rhythm, no murmurs. Abdomen is soft, nontender, with normal bowel sounds. Extremities show no edema. Skin is warm and dry. Neurologic exam is grossly intact."),
  l("lis-27", "Blood Sugar Phone Note", 'medical', "intermediate", "Telephone encounter. Spoke with the patient's daughter regarding his blood sugar readings. She reports fasting values ranging from 130 to 160 this week, no episodes below 80. Patient is tolerating metformin without stomach upset. Advised continuing the current dose and keeping a log of morning readings. Will review at the appointment next Thursday. Instructed to call back or go to the emergency department for readings over 300 or confusion."),
  l("lis-28", "Pneumonia and Diabetes Plan", 'medical', "advanced", "Assessment and plan. Number one, community acquired pneumonia, right lower lobe, confirmed on chest x-ray. CURB-65 score of one, appropriate for outpatient management. Given her diabetes, start levofloxacin 750 milligrams daily for five days. Number two, poorly controlled type 2 diabetes with an A1c of 9.1. Increase metformin to 1000 milligrams twice daily with meals. Counseled on diet and hypoglycemia warning signs. Recheck A1c in three months. Return precautions reviewed, including worsening dyspnea, fever above 101, or persistent vomiting."),
  l("lis-29", "Chest CT Impression", 'medical', "advanced", "Reading back the CT impression. Impression, number one, 7 millimeter noncalcified pulmonary nodule in the left upper lobe, recommend follow up CT in six to twelve months per Fleischner criteria. Number two, no evidence of pulmonary embolism to the segmental level. Number three, mild dependent atelectasis at both lung bases. Number four, incidental 2 centimeter simple appearing hepatic cyst, no further imaging required. No mediastinal or hilar lymphadenopathy. Heart size within normal limits. No pleural effusion or pneumothorax identified."),
  l("lis-30", "Urosepsis ED Course", 'medical', "advanced", "ED course. Patient arrived tachycardic with a heart rate of 118 and BP of 92 over 60. Two large bore IVs placed, given a one liter normal saline bolus with improvement to BP of 108 over 70. Labs notable for lactate of 3.2, white count of 14.5, creatinine 1.4 from a baseline of 0.9. Blood cultures drawn, started on ceftriaxone 2 grams IV. Repeat lactate down to 1.8. Patient remained hemodynamically stable, urine output adequate. Admitted to medicine for presumed urosepsis."),
]
