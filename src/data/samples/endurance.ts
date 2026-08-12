import type { TranscribeSample } from '../../lib/types'

const e = (
  id: string,
  title: string,
  domain: TranscribeSample['domain'],
  difficulty: TranscribeSample['difficulty'],
  transcript: string,
): TranscribeSample => ({
  id,
  kind: 'transcribe',
  skill: 'endurance',
  title,
  domain,
  difficulty,
  transcript,
})

export const ENDURANCE_SAMPLES: TranscribeSample[] = [
  e(
    'end-01',
    'Morning clinic dictation',
    'medical',
    'intermediate',
    `First note. Follow-up visit for hypertension and high cholesterol. The patient reports good energy, no chest pain, no shortness of breath, and no swelling in the legs. Home blood pressure readings average 132 over 80. He walks thirty minutes most evenings and has cut back to one coffee a day. The exam is unremarkable. We will continue the current dose of lisinopril, repeat a lipid panel before the next visit, and see him again in four months.

Second note. A young woman here with two weeks of seasonal allergy symptoms: itchy eyes, sneezing, and a runny nose that is worse outdoors. No fever, no facial pain, and no cough. She tried an over-the-counter antihistamine with partial relief. We discussed adding a daily nasal steroid spray and using it correctly. She will return if symptoms last past the spring or if she develops sinus pressure.

Third note. An established patient with type 2 diabetes here for his quarterly check. His A1C is 7.4, down from 7.9, and he is rightly proud of the change. He credits smaller portions at dinner and a walk after lunch. His feet show no sores or numbness, and his last eye exam was six months ago. We will continue metformin at the current dose, order a urine protein check, and repeat labs in three months. He asked about a flu shot and received one before leaving.

End of dictation. Please file each note to the correct chart and flag the second one for a nurse callback in two weeks.`,
  ),
  e(
    'end-02',
    'Evening shift report',
    'medical',
    'intermediate',
    `Report for the evening shift, four patients to hand over.

Room 301 is a 71-year-old woman, day two after a knee replacement. Pain is controlled with the scheduled regimen, and she walked twice today with the therapist. Her drain came out this morning. Watch for swelling in the calf; she is on the usual blood thinner and it is due at nine.

Room 304 is a 45-year-old man admitted for pneumonia. He is on his second day of antibiotics and finally trending the right way: fever down since noon, oxygen at two liters, saturations holding at 94. If he stays this course overnight, we will trial room air at breakfast. He sleeps poorly, so cluster your checks.

Room 307 is a 58-year-old woman with chest pain ruled not cardiac this afternoon. She is relieved but embarrassed, and she may ask to leave tonight. The plan is discharge in the morning after a stress test; please reinforce why staying matters. Her husband has the updated instructions.

Room 310 is our watcher: an 83-year-old man admitted after a fall at home. He is oriented during the day and foggy after dark, so keep the room lit in the early evening, the bed low, and the call light in his hand. His daughter left her number on the board; she asked to be called if anything changes, any hour.

Labs for the floor print at five. The pharmacy is short-staffed tonight, so order anything you need before eleven. And the elevator on the east wing is out again; plan your transport times with an extra five minutes in mind. That is the floor. Have a quiet night.`,
  ),
  e(
    'end-03',
    'Discharge summary',
    'medical',
    'advanced',
    `This is the discharge summary for a 66-year-old man admitted five days ago with community-acquired pneumonia and a mild exacerbation of chronic obstructive pulmonary disease.

He presented to the emergency department with three days of productive cough, fever to 101.8, and breathlessness after one flight of stairs. On arrival he was febrile and mildly hypoxic at 88 percent on room air, with coarse crackles at the right base. The chest film showed a right lower lobe consolidation without effusion. Blood cultures were drawn and remained negative at five days. He was started on intravenous antibiotics, scheduled bronchodilators, and a short steroid taper.

His course was steadily favorable. Oxygen was weaned by day three, and he walked the hallway without desaturation on day four. Antibiotics were converted to an oral course on day three; he will complete a total of seven days at home. The steroid taper finishes on Saturday, and his home inhalers resume today at the previous doses.

Discharge medications, with changes marked: amoxicillin-clavulanate for three more days, new. Prednisone taper as written on the attached schedule, new. Tiotropium daily, unchanged. Albuterol as needed, unchanged. Lisinopril 20 milligrams daily, unchanged. He was counseled on each medication, and the pharmacy has the updated list.

Follow-up arrangements are as follows. He will see his primary physician within one week; the office was called and expects him. A repeat chest film is scheduled in six weeks to document clearing. He was strongly advised to complete the pneumonia vaccination series and to schedule this year's flu shot, and he agreed. Smoking cessation was discussed at length; he has cut from a pack to half a pack daily and accepted a referral to the quit line.

Return precautions were reviewed in plain terms: fever above 100.4, breathlessness at rest, chest pain, confusion, or any cough productive of blood should prompt a call to the office or a return to the emergency department without delay. He verbalized understanding.

Condition at discharge: afebrile for 48 hours, saturating 94 percent on room air, walking independently, tolerating a regular diet. Prognosis is good, contingent on completing the antibiotic course and continued smoking reduction. End of summary.`,
  ),
  e(
    'end-04',
    'Grand rounds case',
    'medical',
    'advanced',
    `Today's case is a 52-year-old woman who came to the clinic with six months of intermittent palpitations, and the lesson is about listening past the obvious.

Her episodes arrived without warning: a sudden fluttering in the chest, lasting minutes, sometimes with lightheadedness, never with fainting. Coffee had been blamed, then stress, then a wearable device that recorded nothing useful. By the time she reached us, she had normal thyroid labs, a normal echocardiogram, and a growing file of reassurance that did not reassure her.

The history held the clue. Asked what the flutter felt like, she tapped it out on the desk: fast and regular, starting and stopping like a switch. Sudden onset, sudden offset, a rate near 180. That pattern pointed toward a re-entrant rhythm rather than the irregular stumble of premature beats. The second clue was what stopped it. Twice, she said, bearing down while lifting groceries seemed to end an episode within seconds. That is a vagal maneuver terminating a rhythm, described by a patient who had never heard the term.

A thirty-day event monitor caught it in week two: a narrow-complex tachycardia at 178 with abrupt onset and offset, consistent with supraventricular tachycardia. She was taught structured vagal maneuvers by the nursing team and given a plan for episodes lasting beyond fifteen minutes. After a discussion of options, she chose an electrophysiology referral, and an ablation the following month found and treated the re-entrant pathway. She has been symptom-free for a year.

Three teaching points. First, the character of onset and offset is diagnostic gold in palpitations; ask patients to tap the rhythm, because hands remember what words blur. Second, a normal echocardiogram and normal labs exclude many dangerous things, but they do not explain the symptom; the absence of an answer is not reassurance. Third, the monitor you choose matters less than the duration you choose; intermittent symptoms need patient recording windows, and a two-week miss is data about frequency, not proof of health.

The diagnosis was waiting in the story the whole time. Our job was to ask the question that let her tell it. Questions are welcome at the end of the hour.`,
  ),
  e(
    'end-05',
    'Closing argument',
    'legal',
    'intermediate',
    `Members of the jury, at the start of this trial I asked you to keep one question in mind: what did the company know, and when did it know it? You now have the answer, and it did not come from my client. It came from the company's own documents.

Start with the inspection report of March 12. The ladder bracket on line three was flagged, in writing, as a fall hazard. The recommended fix cost two hundred dollars and one afternoon. The report was initialed by the shift supervisor and forwarded to maintenance. Nothing happened.

Move to April 3. A second report, same bracket, sharper language. This time someone wrote a work order, and the work order sat in a queue behind resurfacing the visitor parking lot. You saw the queue. You saw what the company judged more urgent than the thing that could drop a man twelve feet onto concrete.

Then May 19. Not a report this time; an email from a line worker, plain words: someone is going to get hurt on that ladder. The reply, and I quote, was noted. Noted. Three warnings, two months, zero dollars spent. And on June 8, David Chen climbed that ladder because his job required it, and the bracket gave way exactly as predicted, and he has not worked a full week since.

The defense told you accidents happen. That is true, and it is beside the point. This was not an accident in any honest sense of the word; it was an appointment. The company kept rescheduling the repair, so the injury kept the appointment instead.

The law does not ask a company to be perfect. It asks a company to be reasonable, to fix what it knows is broken before it breaks a person. Measure the evidence against that standard. If you do, your verdict will say what those three documents already said, and this time, someone will finally listen. Thank you.`,
  ),
  e(
    'end-06',
    'Intake interview memo',
    'legal',
    'intermediate',
    `Memo to file, summarizing this morning's intake interview with a prospective client regarding a residential construction dispute.

The client and her spouse hired a contractor last October to renovate a kitchen and an adjacent laundry room. The written contract, which she brought and I copied, sets a price of forty-eight thousand dollars, a ten-week schedule, and progress payments in four installments tied to milestones. Work began November 1. The first two installments, totaling twenty-four thousand, were paid on time by check; we have both canceled checks.

The problems began at the third milestone, rough inspection. The city inspector failed the electrical work twice, in January and again in February. The contractor blamed the failures on a subcontractor and asked for the third installment anyway, calling the inspection a formality. The client declined. In March, the contractor's crew stopped appearing. Since April 2, the client has had no response to calls, texts, or a certified letter, which was returned unclaimed.

The kitchen is presently unusable: open walls, capped plumbing, no counters. A second contractor examined the site last week and estimates thirty-one thousand dollars to complete the work, including correcting the failed electrical. Photographs from before and after the stoppage are in the shared folder, along with the inspection cards.

Preliminary assessment: strong documentation, clear milestones, and a paper trail of nonperformance. Open questions include whether the contractor holds a current license, whether his bond can be reached, and whether other homeowners have filed similar complaints, which the client believes but cannot verify. Next steps, pending engagement: pull the license and bond records, send a demand letter with a fourteen-day cure period, and calendar the statute of limitations conservatively from the last day work was performed. The client was advised not to authorize demolition or further work until the site is fully documented.`,
  ),
  e(
    'end-07',
    'Jury instructions',
    'legal',
    'advanced',
    `Members of the jury, you have heard the evidence, and it is now my duty to instruct you on the law. You must follow these instructions even if you disagree with them, and you must apply them to the facts as you find them, because you, and only you, are the judges of the facts.

First, the burden of proof. The plaintiff must prove each element of her claim by a preponderance of the evidence. Preponderance means more likely true than not true. It is not proof beyond a reasonable doubt, which belongs to criminal cases, and it is not mere possibility or speculation. If the evidence on any element is evenly balanced, your finding on that element must be for the defendant.

Second, the elements of negligence. The plaintiff must prove four things: that the defendant owed her a duty of care; that the defendant breached that duty; that the breach caused her injury; and that she suffered damages as a result. Duty is the obligation to use the care a reasonably prudent person would use in the same circumstances. Breach is the failure to do so. Causation has two parts: the injury must not have occurred without the breach, and the injury must be a foreseeable result of it.

Third, evaluating witnesses. You may believe all, part, or none of any witness's testimony. Consider each witness's opportunity to observe, their memory, their manner while testifying, any interest in the outcome, and whether the testimony was contradicted or supported by other evidence. The testimony of one witness, if you believe it, is enough to prove any fact.

Fourth, expert witnesses. You heard testimony from witnesses described as experts. You are not required to accept an expert's opinion. Give it the weight you find it deserves, considering the expert's qualifications, the basis for the opinion, and the reliability of the information supporting it.

Finally, your deliberations. Your verdict must be unanimous. Each of you must decide the case for yourself, but only after impartial consideration with your fellow jurors. Do not surrender an honest conviction merely to return a verdict, and do not let sympathy, prejudice, or public opinion influence you. When you have reached your verdict, your foreperson will sign the form and notify the bailiff.`,
  ),
  e(
    'end-08',
    'Contract review walkthrough',
    'legal',
    'advanced',
    `Recording a walkthrough of the master services agreement, version four, received from the counterparty on Tuesday. Section by section, here is where we stand.

Section 2, scope. The services description now incorporates the statement of work by reference, which we requested. However, the phrase as reasonably directed by the client survives in 2.3, and it is too elastic. Propose replacing it with as specified in the applicable statement of work. That keeps changes inside the change-order process where they belong.

Section 4, payment. Net forty-five, unchanged, with a late fee of one percent monthly. Finance can live with net forty-five if the late fee applies only after written notice and a ten-day cure. Add that cure language; it protects us from a fee triggered by an invoice that never arrived.

Section 7, intellectual property. This is the sticking point. As drafted, all work product vests in the client on creation, including our preexisting tools. That would quietly transfer the library we bring to every engagement. We need a carve-out: preexisting materials and general know-how remain ours, with a broad license to the client for anything delivered. This point is not negotiable, and it has killed deals before; raise it early in the call, not last.

Section 9, liability. The cap is twelve months of fees, which is market. But the carve-outs swallow the cap: they exclude any breach of confidentiality, not just gross negligence or willful misconduct. Confidentiality claims are exactly where damages get speculative. Narrow the carve-out, or negotiate a separate, higher cap for that category, say two times fees.

Section 12, termination. Either party may terminate for convenience on thirty days' notice. That is fine for them and bad for us mid-project. Ask for ninety days on engagements with committed staffing, or a wind-down fee equal to four weeks of scheduled work.

The remaining sections, notices, governing law, assignment, are standard and acceptable as drafted. Overall posture: we are two issues from signature, intellectual property and the liability carve-out. Everything else is polish. Please circulate this summary to the deal team before Thursday's call, and flag any disagreement by noon Wednesday so we present one position, not three.`,
  ),
  e(
    'end-09',
    'Oral history: the paper mill',
    'general',
    'intermediate',
    `My grandfather worked at the paper mill for thirty-one years, and for most of my childhood I thought the whole town smelled like warm cardboard. Nobody minded. That smell meant everything was working.

The mill ran on a rhythm you could set a clock by. Shift change at six, two, and ten. The gates opened, one crowd walked in, another walked out, and for ten minutes the sidewalks on Bridge Street were the busiest place in the county. My grandmother could tell time by the sound of the line starting up, a low hum that settled into the floorboards of every house within a mile.

What people remember now is the closing, but what I remember is the competence. Everyone in that building knew exactly what they were doing. My grandfather could tell from the sound alone when a roller was a week from failing. His friend Ruth ran the cutting line and could eyeball a quarter inch at forty feet. There was a pride in that place you could lean on.

The announcement came on a Tuesday in March. Two hundred and forty jobs, gone by summer. The company called it consolidation. The town called it what it was. Some families left within the year; the school lost a whole grade's worth of kids. But here is the part that doesn't make the documentaries: the ones who stayed rebuilt around the skills, not the mill. The machine shop that fixes hospital equipment two towns over, that's three mill mechanics. The woman who runs the print shop learned color on the mill's coating line.

The smell is gone now. The building is self-storage units behind a chain-link fence. But walk into any workshop within twenty miles and ask who taught them to measure twice, and the mill comes up by the second sentence. A place can close, it turns out, and still keep working. That is the story nobody filmed, and it is the one worth telling.`,
  ),
  e(
    'end-10',
    'All-hands address',
    'general',
    'intermediate',
    `Thanks, everyone, for making time. I want to do three things in the next few minutes: tell you where we landed, tell you what changes, and tell you what does not.

Where we landed. We closed the year at just under nineteen million in revenue, about eight percent over plan. Customer count grew faster than revenue, which tells you the average deal got smaller; that was deliberate, and I will come back to it. Support response times improved every single quarter, and the team did that while ticket volume nearly doubled. I want that on the record.

What changes. This year we go from one product to a platform, and that word has teeth. It means the integrations team doubles by June. It means we stop building custom features for single customers, even large ones, and I know that sentence lands hard in some rooms. Deals that need custom work will route through a partner program we announce next month. It also means pricing gets simpler: three tiers, published on the website, no haggling. Sales has seen the model; margins survive it.

What does not change. We will not trade support quality for growth; that reputation took five years to build and pays for itself. Remote stays. The Friday demo stays. And the rule that anyone can file a customer pain report and get an answer within a week, that stays, because half of last year's roadmap came from those reports.

Two honest cautions. The platform work will make some quarters look flat while the foundation goes in; plan your expectations accordingly. And hiring will feel slow, because we would rather run short than lower the bar. Questions are open in the usual doc, and I will answer the top ten on Thursday. Thank you for a serious year of work.`,
  ),
  e(
    'end-11',
    'Documentary narration: the harbor',
    'general',
    'advanced',
    `Before the bridge, there was the ferry, and before the ferry, there were the rowing men, who would take a passenger across the strait for a coin and a story. The harbor has always run on that exchange: passage for payment, and news thrown in free.

By the 1880s, the waterfront was the busiest quarter mile in the territory. Grain came down from the valley in wagons that queued past the customs house; timber went out on ships whose masts, people said, made a second forest along the shore. The harbormaster's log from 1887, still legible in the county archive, records ninety-one vessels in a single month, and beside one entry, in a different ink, a note that the lighthouse keeper's daughter had been born during the storm of the ninth.

The harbor made the town, and then it nearly unmade it. The fire of 1911 started in a chandlery and took the pier, the fish sheds, and forty houses in a single night. The response tells you everything about the place: within a week, rebuilding crews were sleeping in the church, and the new pier went out longer than the old one, as if the town were answering the fire with arithmetic.

The twentieth century arrived in stages. Steam replaced sail, then trucks replaced steam, and the railroad, which had bypassed the town in 1902 out of spite, according to local memory, and out of geology, according to the engineers, never came at all. The big ships moved to the deepwater port up the coast. By 1968, the harbor that had launched ninety-one vessels a month was down to a fishing fleet of eleven boats.

What saved it was not nostalgia. It was refrigeration. A cannery retooled to flash-freeze, the fleet specialized in a single premium catch, and the harbor learned to sell quality where it had once sold volume. The boats today carry sonar their grandfathers would have called witchcraft, and the morning auction happens on phones before the hulls touch the dock.

But stand at the seawall at first light and the essential transaction is unchanged: passage for payment, risk for reward, and news thrown in free. The harbor never needed to be big. It needed to be necessary, and it still is.`,
  ),
  e(
    'end-12',
    'Earnings call prepared remarks',
    'general',
    'advanced',
    `Good afternoon, and thank you for joining our fourth quarter call. I will walk through results, then the outlook, and then we will open the line for questions.

Revenue for the quarter was 61.4 million dollars, up 14 percent year over year and 4 percent sequentially. Full-year revenue closed at 228 million, up 17 percent. Growth was led once again by the enterprise segment, which now represents 58 percent of revenue, up from 51 a year ago. Net revenue retention finished at 113 percent, and we ended the year with 342 customers above one hundred thousand dollars in annual spend, an increase of 61.

Gross margin was 74 percent, up two points from last year, driven by workload optimization and the data center consolidation we completed in September. Operating margin reached 9 percent, our fourth consecutive profitable quarter. Free cash flow for the year was 31 million dollars, and we ended the quarter with 410 million in cash and equivalents and no debt.

Two dynamics deserve context. First, monthly-plan churn rose modestly in the quarter, concentrated in the smallest cohort. We attribute this to seasonal budget resets rather than competitive losses, and January renewals support that read, but we are watching it and will report the trend next quarter either way. Second, our largest customer completed a planned migration to a usage-based contract. This reduces near-term reported revenue by roughly a million dollars a quarter while aligning us with their growth, and we consider the trade well worth it.

Turning to the outlook. For the first quarter, we expect revenue between 62 and 63.5 million dollars. For the full year, we are guiding to a range of 258 to 264 million, representing 13 to 16 percent growth. This guidance embeds the migration headwind I just described and assumes no material change in the macro environment. We expect operating margin to expand roughly one point for the year, as continued efficiency funds the platform investments we outlined at the analyst day.

Before questions, one note on capital allocation. The board has authorized a repurchase program of up to 50 million dollars. We view this as opportunistic, not programmatic; the first priority for capital remains the product.

With that, operator, please open the line.`,
  ),

  // ---- Medical scribe ----
  e("end-13", "Sinusitis Clinic Visit", 'medical', "intermediate", "This is a full clinic note for a 48-year-old woman here today with a chief complaint of cough and sinus pressure for ten days. She says the illness started as a runny nose and sore throat, and over the last four days the drainage has turned thick and green, with pressure over her cheeks and upper teeth that gets worse when she bends forward. She has had low-grade fevers at home up to 100.6, some fatigue, and a wet cough that is worse at night. No shortness of breath, no chest pain, no ear pain. She tried over-the-counter decongestants with only brief relief. Her past medical history includes seasonal allergies and mild asthma, for which she uses an albuterol inhaler as needed, maybe twice a month. She takes loratadine 10 mg daily during the spring. No known drug allergies. She works as a school teacher and does not smoke.\n\nOn exam today she is alert and in no distress. Vital signs show a temp of 99.8, heart rate of 84, BP of 122 over 78, and oxygen saturation of 98 percent on room air. There is tenderness to palpation over both maxillary sinuses. The nasal turbinates are swollen with thick drainage on the right side. The back of the throat shows postnasal drip without exudate. Both eardrums are clear. Lungs are clear to auscultation with no wheezing today, and heart sounds are regular.\n\nMy assessment is acute bacterial sinusitis, given ten days of symptoms that are worsening rather than improving. The plan is amoxicillin clavulanate 875 mg twice daily for ten days, saline nasal rinses twice a day, and fluticasone nasal spray, two sprays in each nostril daily. She should continue her loratadine. I told her to call if she develops a high fever, vision changes, severe headache, or swelling around the eye, and to return in two weeks if symptoms have not fully cleared. She agrees with the plan."),
  e("end-14", "Four Patient Morning Rounds", 'medical', "intermediate", "These are my morning rounds for today, four patients on the medicine floor.\n\nFirst patient, room 412, is a 71-year-old man on day three for community-acquired pneumonia. He feels better, his cough is looser, and he ate breakfast this morning. Overnight temp max was 99.2, heart rate of 78, oxygen saturation 94 percent on room air. Lungs still have crackles at the right base but they are improved. We will switch him from IV ceftriaxone to oral cefpodoxime today and plan discharge tomorrow if he stays afebrile.\n\nSecond patient, room 415, is a 64-year-old woman with a heart failure exacerbation. She is down two liters net since admission and her weight has dropped three pounds. She slept lying flat without getting short of breath for the first time. BP of 108 over 64, heart rate of 72. There is still trace swelling at the ankles. Continue IV furosemide 40 mg twice daily today, check a basic metabolic panel this afternoon, and if the potassium is stable we will move to oral diuretics tomorrow.\n\nThird patient, room 420, is a 39-year-old man with cellulitis of the left lower leg. The redness has pulled back about two centimeters from the marked border and he says the pain is much better. He has had no fever for twenty-four hours. We will change him to oral cephalexin 500 mg four times a day, and he can go home this afternoon with a wound check in three days.\n\nFourth patient, room 423, is an 82-year-old woman admitted with a urinary tract infection and confusion. Her mental status is clearer this morning and she knew the date and where she was. The urine culture grew E. coli sensitive to ceftriaxone, so we will continue that antibiotic for now. She is drinking well. Physical therapy will see her today to decide whether she is safe for home or needs short-term rehab, and we have a family meeting at two o'clock."),
  e("end-15", "NSTEMI Discharge Summary", 'medical', "advanced", "This is the discharge summary for a 59-year-old woman admitted four days ago with a non ST elevation myocardial infarction. She presented to the emergency department with two hours of substernal chest pressure radiating to the left arm, associated with diaphoresis and nausea. Initial troponin was 0.9, rising to 2.4 on the second draw, and the electrocardiogram showed T wave inversions in the lateral leads without ST elevation. She was started on aspirin, high intensity statin therapy, and a heparin infusion, and cardiology was consulted from the emergency department.\n\nHospital course. On hospital day one she underwent left heart catheterization, which revealed a 90 percent stenosis of the proximal left circumflex artery, treated with a drug eluting stent, and a 40 percent nonobstructive lesion in the mid right coronary artery. Post procedure echocardiogram showed an ejection fraction of 48 percent with mild hypokinesis of the lateral wall. Her chest pain resolved, troponin trended down, and she was monitored on telemetry without arrhythmia. Mild volume overload after the procedure responded to a single dose of IV furosemide. The right radial access site remained clean and intact, without hematoma or bruit.\n\nDischarge medications are as follows. Aspirin 81 mg daily indefinitely. Ticagrelor 90 mg twice daily for at least twelve months, and I stressed that she must not stop this medication without speaking to cardiology first. Atorvastatin 80 mg nightly. Metoprolol succinate 50 mg daily. Lisinopril 5 mg daily, newly started for the reduced ejection fraction. Her home omeprazole was continued at 20 mg daily.\n\nDischarge condition is good. She is ambulating independently and chest pain free, with a BP of 118 over 70 and a resting heart rate of 64. Discharge labs showed a creatinine of 0.9, hemoglobin of 12.8, and a potassium of 4.2.\n\nFor follow-up, she will see cardiology in one week for an access site check and medication review, and her primary care physician in two weeks. A cardiac rehabilitation referral was placed. She was counseled at length on smoking cessation given her half pack per day habit, and she accepted a prescription for nicotine patches. She was instructed to return to the emergency department immediately for recurrent chest pressure, shortness of breath, syncope, or any bleeding at the wrist access site. She verbalized understanding, and all of her questions were answered before discharge."),
  e("end-16", "Renal Colic ED Course", 'medical', "advanced", "This is the emergency department note for a 34-year-old man who arrived by private vehicle at 6:40 this morning with sudden onset right flank pain. The pain began about two hours before arrival, woke him from sleep, and comes in waves, radiating from the right flank around to the right groin. He rates it ten out of ten at its worst. He has vomited twice and cannot find a comfortable position. He denies fever, chills, dysuria, or gross hematuria, although he thinks his urine looked dark this morning. There is no prior history of kidney stones. Past medical history is significant only for mild hypertension, not currently treated. He takes no daily medications and has no known drug allergies.\n\nTriage vitals showed a BP of 152 over 94, heart rate of 104, respiratory rate of 20, temp 98.9, and oxygen saturation of 99 percent on room air. On my exam he is diaphoretic and writhing on the stretcher, unable to hold still. The abdomen is soft and nontender, without rebound or guarding, and there is right costovertebral angle tenderness. Testicular exam is normal, without swelling or tenderness, and there are no hernias.\n\nIn the department he received ketorolac 15 mg IV and ondansetron 4 mg IV, with excellent relief within thirty minutes, along with a liter of normal saline. Urinalysis showed large blood with more than fifty red cells per high power field, no nitrites, and no leukocyte esterase. Creatinine came back at 1.0 and the white count was 9.8. CT of the abdomen and pelvis without contrast demonstrated a 4 millimeter stone in the distal right ureter with mild hydronephrosis, no perinephric stranding, and no other acute findings. The left kidney was normal.\n\nOn reassessment he was comfortable and tolerating oral fluids, with the heart rate down to 82 and a BP of 134 over 82. Given the small stone size, the high likelihood of spontaneous passage, normal renal function, and no signs of infection, he is safe for discharge home. He will take tamsulosin 0.4 mg nightly to help the stone pass, and ibuprofen 600 mg every six hours with food as needed for pain. He was given a urine strainer and told to bring in anything he catches. Strict return precautions were reviewed. He should come back immediately for fever over 100.4, uncontrolled pain or vomiting, inability to urinate, or worsening flank pain. Urology follow-up within one week if the stone has not passed. He verbalized understanding and was discharged ambulatory in stable condition."),
]
