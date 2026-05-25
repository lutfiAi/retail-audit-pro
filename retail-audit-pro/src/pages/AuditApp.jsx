import { useState, useMemo } from "react";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  ar: {
    appTitle:"نظام التدقيق الشامل", appSub:"Retail Audit Pro",
    modeStore:"تدقيق المعارض", modeHQ:"تدقيق الإدارة العليا",
    modeStoreDesc:"فحص ميداني على مستوى المتجر أو المعرض",
    modeHQDesc:"تدقيق استراتيجي على مستوى المكاتب الرئيسية",
    finalReport:"التقرير النهائي", reportTitle:"التقرير النهائي",
    storeName:"اسم المعرض", storeCode:"الرقم", region:"المنطقة",
    hqName:"اسم الإدارة / القسم", hqCode:"الرمز", hqRegion:"الموقع",
    auditor:"المدقق", date:"التاريخ",
    items:"بنود", answered:"تمت الإجابة", completed:"✓ مكتمل",
    back:"← رجوع", print:"🖨️ طباعة PDF",
    notSat:"غير راضي", acceptable:"مقبول", satisfied:"راضي",
    high:"عالي", medium:"متوسط", low:"منخفض", risk:"الخطورة",
    notePlaceholder:"ملاحظة...",
    deptBreakdown:"أداء الأقسام التفصيلي",
    criticalTitle:"بنود عالية الخطورة تستوجب إجراءً فوريًا",
    recommendTitle:"التوصيات ومقترحات التحسين",
    recPlaceholder:(d)=>`توصيات قسم ${d}...`,
    sigStore:"مدير المعرض", sigAuditor:"المدقق", sigArea:"مدير المنطقة",
    sigHQ1:"المدير التنفيذي", sigHQ2:"المدقق الداخلي", sigHQ3:"مجلس الإدارة",
    sigLine:"التوقيع والتاريخ",
    excellent:"ممتاز", vgood:"جيد جداً", good:"جيد", acceptable2:"مقبول", weak:"ضعيف",
    scoreOf:"درجة", deptOf:"/", totalScore:"الدرجة الإجمالية",
    switchLang:"EN", dir:"rtl",
    storeAuditLabel:"🏪 مستوى المعارض", hqAuditLabel:"🏢 مستوى الإدارة العليا",
    changeMode:"تغيير نوع التدقيق",
    auditType:"نوع التدقيق",
  },
  en: {
    appTitle:"Comprehensive Audit System", appSub:"Retail Audit Pro",
    modeStore:"Store Audit", modeHQ:"Head Office Audit",
    modeStoreDesc:"Field inspection at store or showroom level",
    modeHQDesc:"Strategic audit at head office & management level",
    finalReport:"Final Report", reportTitle:"Final Audit Report",
    storeName:"Store Name", storeCode:"Code", region:"Region",
    hqName:"Department / Division", hqCode:"Code", hqRegion:"Location",
    auditor:"Auditor", date:"Date",
    items:"Items", answered:"Answered", completed:"✓ Done",
    back:"Back →", print:"🖨️ Print PDF",
    notSat:"Unsatisfied", acceptable:"Acceptable", satisfied:"Satisfied",
    high:"High", medium:"Medium", low:"Low", risk:"Risk",
    notePlaceholder:"Notes...",
    deptBreakdown:"Department Breakdown",
    criticalTitle:"High-Risk Items Requiring Immediate Action",
    recommendTitle:"Recommendations & Improvement Suggestions",
    recPlaceholder:(d)=>`${d} recommendations...`,
    sigStore:"Store Manager", sigAuditor:"Auditor", sigArea:"Area Manager",
    sigHQ1:"CEO", sigHQ2:"Internal Auditor", sigHQ3:"Board of Directors",
    sigLine:"Signature & Date",
    excellent:"Excellent", vgood:"Very Good", good:"Good", acceptable2:"Acceptable", weak:"Poor",
    scoreOf:"pts", deptOf:"/", totalScore:"Overall Score",
    switchLang:"عربي", dir:"ltr",
    storeAuditLabel:"🏪 Store Level", hqAuditLabel:"🏢 Head Office Level",
    changeMode:"Change Audit Type",
    auditType:"Audit Type",
  },
};

// ─── STORE DEPARTMENTS ────────────────────────────────────────────────────────
const STORE_DEPTS = [
  {
    id:"ops", icon:"⚙️",
    label:{ar:"العمليات التشغيلية",en:"Store Operations"},
    color:{bg:"bg-sky-600",light:"bg-sky-50",border:"border-sky-200",text:"text-sky-700"},
    sections:[
      { id:"ops1", title:{ar:"جاهزية المتجر والافتتاح",en:"Store Readiness & Opening"}, items:[
        {id:"o1.1",risk:"H",text:{ar:"هل يتم تطبيق Checklist الافتتاح الصباحي بالكامل قبل فتح الأبواب؟",en:"Is the morning opening checklist fully completed before opening doors?"}},
        {id:"o1.2",risk:"H",text:{ar:"هل جميع أجهزة الكاشير ونقاط البيع (POS) تعمل بشكل صحيح في بداية اليوم؟",en:"Are all POS systems working correctly and calibrated at start of day?"}},
        {id:"o1.3",risk:"M",text:{ar:"هل مستلزمات التشغيل متوفرة بكميات كافية (أكياس، فواتير، ورق طابعات)؟",en:"Are operating supplies available in sufficient quantities (bags, receipts, printer paper)?"}},
        {id:"o1.4",risk:"M",text:{ar:"هل الإضاءة تعمل بشكل كامل في جميع أقسام المعرض ومنطقة الكاشير؟",en:"Is the lighting fully operational across all store sections and cashier area?"}},
        {id:"o1.5",risk:"L",text:{ar:"هل درجات حرارة المعرض مضبوطة بشكل مناسب لتجربة التسوق؟",en:"Is the store temperature set appropriately for a comfortable shopping experience?"}},
      ]},
      { id:"ops2", title:{ar:"تجربة العميل وجودة الخدمة",en:"Customer Experience & Service"}, items:[
        {id:"o2.1",risk:"H",text:{ar:"هل يرحب الموظفون بالعملاء فور دخولهم وفق معايير الشركة؟",en:"Do staff greet customers upon entry according to company standards?"}},
        {id:"o2.2",risk:"H",text:{ar:"هل وقت الانتظار عند الكاشير ضمن المعايير المقبولة (أقل من 5 دقائق)؟",en:"Is cashier waiting time within acceptable standards (under 5 minutes)?"}},
        {id:"o2.3",risk:"H",text:{ar:"هل يتعامل الموظفون مع شكاوى العملاء وفق بروتوكول الشركة؟",en:"Do staff handle customer complaints per company protocol professionally?"}},
        {id:"o2.4",risk:"M",text:{ar:"هل يتمتع الموظفون بمعرفة كافية بالمنتجات وقادرون على توجيه العملاء؟",en:"Do staff have sufficient product knowledge to effectively guide customers?"}},
        {id:"o2.5",risk:"H",text:{ar:"هل تُطبَّق سياسة الاستبدال والإرجاع بشكل صحيح وموحّد من جميع الموظفين؟",en:"Is the exchange and return policy applied correctly and uniformly by all staff?"}},
        {id:"o2.6",risk:"L",text:{ar:"هل يُشعر الموظفون العملاء بالعروض والخصومات الحالية بشكل استباقي؟",en:"Do staff proactively inform customers about current offers and discounts?"}},
      ]},
      { id:"ops3", title:{ar:"الأمن والسلامة",en:"Security & Safety"}, items:[
        {id:"o3.1",risk:"H",text:{ar:"هل كاميرات المراقبة تعمل بكامل طاقتها وتغطي جميع النقاط الحساسة دون نقاط عمياء؟",en:"Are all surveillance cameras fully operational covering all sensitive areas without blind spots?"}},
        {id:"o3.2",risk:"H",text:{ar:"هل تُطبَّق إجراءات تفتيش الموظفين عند المغادرة بشكل منتظم؟",en:"Are staff bag-check procedures upon departure applied regularly and consistently?"}},
        {id:"o3.3",risk:"H",text:{ar:"هل نظام التحكم في الدخول إلى المخزن والمناطق الحساسة يعمل بكفاءة؟",en:"Is the access control system to the warehouse and sensitive areas functioning efficiently?"}},
        {id:"o3.4",risk:"H",text:{ar:"هل طفايات الحريق صالحة وموزعة حسب مخطط السلامة المعتمد؟",en:"Are fire extinguishers valid and distributed per the approved safety plan?"}},
        {id:"o3.5",risk:"H",text:{ar:"هل مخارج الطوارئ واضحة وغير مسدودة وموضحة بلافتات مضيئة؟",en:"Are emergency exits clearly marked, unobstructed, and indicated with illuminated signs?"}},
        {id:"o3.6",risk:"M",text:{ar:"هل الموظفون مدربون على إجراءات الطوارئ والإخلاء وتواريخ التدريب محفوظة؟",en:"Are staff trained on emergency procedures with training dates on record?"}},
      ]},
      { id:"ops4", title:{ar:"المخزون والعمليات اللوجستية",en:"Inventory & Logistics"}, items:[
        {id:"o4.1",risk:"H",text:{ar:"هل يتم استلام البضاعة مع التحقق الكامل من الكميات والحالة بالتوثيق المطلوب؟",en:"Is merchandise received with full quantity and condition verification and proper documentation?"}},
        {id:"o4.2",risk:"H",text:{ar:"هل يتم الإبلاغ الفوري عن أي فروقات (زيادة/نقص/تلف) في نفس يوم الاستلام؟",en:"Are discrepancies (excess/shortage/damage) reported on the same delivery day?"}},
        {id:"o4.3",risk:"M",text:{ar:"هل المخزن منظم حسب الأقسام مع تطبيق نظام FIFO لإدارة تواريخ الانتهاء؟",en:"Is the warehouse organized by sections with FIFO applied for expiry date management?"}},
        {id:"o4.4",risk:"H",text:{ar:"هل يتم تتبع المنتجات منتهية الصلاحية وإزالتها وفق التعليمات؟",en:"Are expired products tracked, removed, and handled per instructions?"}},
        {id:"o4.5",risk:"H",text:{ar:"هل يتم تنفيذ جدول الجرد الدوري المعتمد والتحقق من نتائجه؟",en:"Is the approved periodic inventory schedule implemented and results verified?"}},
        {id:"o4.6",risk:"H",text:{ar:"هل نسب انكماش المخزون (Shrinkage) ضمن الهدف المحدد في الميزانية؟",en:"Are inventory shrinkage rates within the budget-defined target?"}},
      ]},
    ],
  },
  {
    id:"fin", icon:"💼",
    label:{ar:"التدقيق المالي",en:"Financial Audit"},
    color:{bg:"bg-emerald-600",light:"bg-emerald-50",border:"border-emerald-200",text:"text-emerald-700"},
    sections:[
      { id:"fin1", title:{ar:"إدارة النقد والكاشير",en:"Cash & Cashier Management"}, items:[
        {id:"f1.1",risk:"H",text:{ar:"هل تتم تسوية صناديق الكاشير يوميًا ومطابقة الرصيد الفعلي مع النظام؟",en:"Are cashier drawers reconciled daily with actual balance matching the system?"}},
        {id:"f1.2",risk:"H",text:{ar:"هل تتم تعبئة صناديق الكاشير بالمبلغ المعتمد فقط في بداية كل وردية وتوثيقها؟",en:"Are cashier drawers filled with only the approved opening float per shift and documented?"}},
        {id:"f1.3",risk:"H",text:{ar:"هل يتم توثيق وتتبع جميع الفروقات النقدية والإبلاغ عنها فورًا للإدارة؟",en:"Are all cash discrepancies documented, tracked, and immediately reported to management?"}},
        {id:"f1.4",risk:"H",text:{ar:"هل عمليات الإرجاع النقدي تتم حصريًا بموافقة مدير المعرض وبالفاتورة الأصلية؟",en:"Are cash refunds processed exclusively with store manager approval and the original invoice?"}},
        {id:"f1.5",risk:"H",text:{ar:"هل يمتلك كل كاشير رقم دخول خاصاً به ولا تتم مشاركة كلمات المرور؟",en:"Does each cashier have unique login credentials with passwords never shared?"}},
      ]},
      { id:"fin2", title:{ar:"الإيداعات البنكية",en:"Bank Deposits"}, items:[
        {id:"f2.1",risk:"H",text:{ar:"هل تتم الإيداعات البنكية يوميًا وفي الأوقات المحددة دون تأخير أو تراكم؟",en:"Are bank deposits made daily at the specified times without delay or accumulation?"}},
        {id:"f2.2",risk:"H",text:{ar:"هل يتم الإيداع من قِبل الشخص المخوّل حصرًا وأمام الكاميرات مع التوثيق الكامل؟",en:"Is the deposit made exclusively by the authorized person in front of cameras with full documentation?"}},
        {id:"f2.3",risk:"H",text:{ar:"هل إيصالات الإيداع البنكي محفوظة ومطابقة لتقارير نهاية اليوم؟",en:"Are bank deposit receipts filed and matching end-of-day reports?"}},
        {id:"f2.4",risk:"M",text:{ar:"هل يتم الإبلاغ الفوري عن أي تأخير في الإيداع لفريق المالية مع توضيح السبب؟",en:"Is any deposit delay immediately reported to the finance team with a clear reason?"}},
      ]},
      { id:"fin3", title:{ar:"التقارير المالية والرقابة",en:"Financial Reports & Controls"}, items:[
        {id:"f3.1",risk:"H",text:{ar:"هل تقارير المبيعات اليومية (DSR) مُرسَلة لقسم المالية في الموعد المحدد؟",en:"Are Daily Sales Reports (DSR) sent to finance on time and complete?"}},
        {id:"f3.2",risk:"H",text:{ar:"هل أرقام المبيعات في التقارير اليدوية مطابقة لأنظمة POS؟",en:"Do sales figures in manual reports match POS system data?"}},
        {id:"f3.3",risk:"H",text:{ar:"هل فواتير المصروفات التشغيلية حاصلة على موافقة مالية مسبقة؟",en:"Are operational expense invoices pre-approved by finance?"}},
        {id:"f3.4",risk:"H",text:{ar:"هل جميع الخصومات الممنوحة موثقة بموافقة مكتوبة من مدير المنطقة والمالية؟",en:"Are all granted discounts documented with written approval from area manager and finance?"}},
        {id:"f3.5",risk:"M",text:{ar:"هل أداء المبيعات مقارنة بالهدف يتم مراجعته أسبوعياً مع خطة تدخل عند الانحراف؟",en:"Is sales performance vs. target reviewed weekly with an intervention plan upon deviation?"}},
        {id:"f3.6",risk:"M",text:{ar:"هل يتم تتبع مؤشر متوسط قيمة الفاتورة (ATV) وإجراءات لرفعه؟",en:"Is Average Transaction Value (ATV) tracked with improvement actions in operations meetings?"}},
      ]},
      { id:"fin4", title:{ar:"الأصول والمصروفات",en:"Assets & Expenses"}, items:[
        {id:"f4.1",risk:"H",text:{ar:"هل سجل الأصول الثابتة محدّث ومطابق للأصول الموجودة فعليًا في المعرض؟",en:"Is the fixed assets register updated and matching assets physically present in the store?"}},
        {id:"f4.2",risk:"M",text:{ar:"هل أوامر الصرف الداخلية معتمدة من الإدارة المختصة قبل الصرف؟",en:"Are internal consumption orders approved by relevant management before issuance?"}},
        {id:"f4.3",risk:"L",text:{ar:"هل يتم مراجعة فاتورة الكهرباء والمرافق شهريًا ومقارنتها بالهدف؟",en:"Are utility bills reviewed monthly and compared to previous month and budget target?"}},
        {id:"f4.4",risk:"H",text:{ar:"هل ملف التراخيص والرسوم التجارية محدّث وجميع الرسوم مسددة في مواعيدها؟",en:"Is the licenses file updated and all fees paid on their due dates?"}},
      ]},
    ],
  },
  {
    id:"hr", icon:"👥",
    label:{ar:"الموارد البشرية",en:"Human Resources"},
    color:{bg:"bg-violet-600",light:"bg-violet-50",border:"border-violet-200",text:"text-violet-700"},
    sections:[
      { id:"hr1", title:{ar:"الامتثال والتوثيق",en:"Compliance & Documentation"}, items:[
        {id:"h1.1",risk:"H",text:{ar:"هل جميع موظفي المعرض لديهم إقامات وتصاريح عمل سارية المفعول؟",en:"Do all store employees have valid residency permits and work authorizations?"}},
        {id:"h1.2",risk:"H",text:{ar:"هل نسبة السعودة في المعرض محققة وفق المعدل المستهدف؟",en:"Is the Saudization (Nitaqat) percentage meeting the targeted rate?"}},
        {id:"h1.3",risk:"M",text:{ar:"هل ملفات الموظفين كاملة وتحتوي على جميع الوثائق المطلوبة؟",en:"Are employee files complete with all required documents (contract, ID, job description)?"}},
        {id:"h1.4",risk:"H",text:{ar:"هل عقود الموظفين محدثة ومطابقة للمسمى الوظيفي والراتب الفعلي؟",en:"Are employee contracts updated and matching actual job title and salary?"}},
        {id:"h1.5",risk:"H",text:{ar:"هل يتم الالتزام بحقوق الموظفين وفق نظام العمل السعودي؟",en:"Is compliance with employee rights per Saudi Labor Law maintained?"}},
      ]},
      { id:"hr2", title:{ar:"الحضور والانضباط",en:"Attendance & Discipline"}, items:[
        {id:"h2.1",risk:"H",text:{ar:"هل نظام تسجيل الحضور فعّال ومرتبط بكشف الرواتب دون تلاعب يدوي؟",en:"Is the attendance tracking system effective and linked to payroll without manual manipulation?"}},
        {id:"h2.2",risk:"M",text:{ar:"هل جداول الورديات موزعة على الموظفين مسبقًا (أسبوع على الأقل)؟",en:"Are shift schedules distributed at least one week in advance and approved by management?"}},
        {id:"h2.3",risk:"M",text:{ar:"هل معدلات الغياب والتأخر ضمن النسبة المقبولة وهل توجد إجراءات رادعة؟",en:"Are absence and tardiness rates within acceptable limits with enforced deterrent procedures?"}},
        {id:"h2.4",risk:"L",text:{ar:"هل يلتزم الموظفون بالزي الرسمي والمظهر اللائق وفق معايير الشركة؟",en:"Do employees comply with dress code and professional appearance per company standards?"}},
        {id:"h2.5",risk:"H",text:{ar:"هل يتوفر لكل موظف بديل معتمد في حالة الغياب الطارئ؟",en:"Is there an approved backup for each employee in case of emergency absence?"}},
      ]},
      { id:"hr3", title:{ar:"الأداء والتطوير",en:"Performance & Development"}, items:[
        {id:"h3.1",risk:"M",text:{ar:"هل تتم تقييمات الأداء للموظفين بشكل منتظم وفق نماذج موحدة معتمدة؟",en:"Are employee performance appraisals conducted regularly using approved unified forms?"}},
        {id:"h3.2",risk:"H",text:{ar:"هل تتوفر خطط تدريبية فعلية للموظفين الجدد (Onboarding)؟",en:"Are actual onboarding training plans available for new employees covering products and systems?"}},
        {id:"h3.3",risk:"M",text:{ar:"هل برامج التدريب المستمر لرفع الكفاءة البيعية تُنفَّذ بشكل دوري وموثق؟",en:"Are continuous training programs for sales efficiency implemented periodically and documented?"}},
        {id:"h3.4",risk:"M",text:{ar:"هل يوجد نظام واضح للمكافآت والحوافز مرتبط بمؤشرات الأداء (KPIs)؟",en:"Is there a clear reward and incentive system linked to KPIs and applied transparently?"}},
        {id:"h3.5",risk:"M",text:{ar:"هل معدل دوران الموظفين (Turnover Rate) ضمن النسبة المقبولة؟",en:"Is the employee turnover rate within acceptable limits with reduction mechanisms in place?"}},
      ]},
      { id:"hr4", title:{ar:"بيئة العمل والالتزام",en:"Work Environment & Engagement"}, items:[
        {id:"h4.1",risk:"M",text:{ar:"هل تُعقد اجتماعات دورية للفريق لمتابعة الأهداف ومشاركة المستجدات؟",en:"Are regular team meetings held to track objectives and share updates?"}},
        {id:"h4.2",risk:"L",text:{ar:"هل يوجد قناة رسمية لاستقبال مقترحات وشكاوى الموظفين والرد عليها؟",en:"Is there an official channel for receiving and responding to employee suggestions and complaints?"}},
        {id:"h4.3",risk:"M",text:{ar:"هل سجل الإجازات السنوية محدث وإجازات الموظفين مخططة مسبقاً؟",en:"Is the annual leave register updated and employee leaves planned in advance?"}},
        {id:"h4.4",risk:"H",text:{ar:"هل سجل الإجراءات التأديبية محفوظ وموثق وموقّع من الموظف والمدير؟",en:"Is the disciplinary action record properly filed, documented, and signed by both parties?"}},
      ]},
    ],
  },
  {
    id:"mkt", icon:"📣",
    label:{ar:"التسويق والمرشنديزينج",en:"Marketing & Merchandising"},
    color:{bg:"bg-rose-600",light:"bg-rose-50",border:"border-rose-200",text:"text-rose-700"},
    sections:[
      { id:"mkt1", title:{ar:"العروض الترويجية والتسعير",en:"Promotions & Pricing"}, items:[
        {id:"m1.1",risk:"H",text:{ar:"هل يتم تطبيق أسعار العروض في النظام والأرفف في نفس وقت الإطلاق؟",en:"Are promotional prices applied in both system and shelves at the exact launch time?"}},
        {id:"m1.2",risk:"H",text:{ar:"هل تتم إزالة مواد العروض المنتهية فورًا عند انتهاء مدة العرض؟",en:"Are expired promotional materials removed immediately upon expiry?"}},
        {id:"m1.3",risk:"M",text:{ar:"هل مواد الترويج البصري (POS Materials) متوفرة وتُعرض وفق الإرشادات؟",en:"Are POS materials available in sufficient quantities and displayed per guidelines?"}},
        {id:"m1.4",risk:"H",text:{ar:"هل تتم مراجعة دقة أسعار العروض للتحقق من صحة نسبة الخصم المعلنة؟",en:"Are promotional prices reviewed against original prices to verify advertised discount accuracy?"}},
        {id:"m1.5",risk:"M",text:{ar:"هل يتم التنسيق مع قسم التسويق مسبقًا لتحضير منتجات الحملات قبل إطلاقها؟",en:"Is advance coordination done with marketing to prepare campaign products before launch?"}},
      ]},
      { id:"mkt2", title:{ar:"تجربة العميل وولاء العلامة",en:"Customer Experience & Brand Loyalty"}, items:[
        {id:"m2.1",risk:"M",text:{ar:"هل يتم قياس رضا العملاء بشكل دوري (NPS أو استبيانات) واتخاذ إجراءات تحسين؟",en:"Is customer satisfaction measured periodically (NPS or surveys) with improvement actions taken?"}},
        {id:"m2.2",risk:"H",text:{ar:"هل يقوم الموظفون بتفعيل عضويات برنامج الولاء وتشجيع العملاء على الاشتراك؟",en:"Do staff proactively activate loyalty program memberships and encourage customer enrollment?"}},
        {id:"m2.3",risk:"H",text:{ar:"هل يتم الرد على تقييمات العملاء على المنصات الرقمية خلال 24 ساعة؟",en:"Are customer reviews on digital platforms responded to within 24 hours?"}},
        {id:"m2.4",risk:"M",text:{ar:"هل بيانات العملاء تُجمَّع وفق سياسة الخصوصية وتُدخَل بشكل صحيح في نظام CRM؟",en:"Is customer data collected per the privacy policy and correctly entered into the CRM system?"}},
        {id:"m2.5",risk:"H",text:{ar:"هل شكاوى العملاء عبر القنوات الرقمية يتم حلها ضمن SLA المحدد؟",en:"Are customer complaints via digital channels resolved within the specified SLA?"}},
      ]},
      { id:"mkt3", title:{ar:"الحضور الرقمي والمحلي",en:"Digital & Local Presence"}, items:[
        {id:"m3.1",risk:"M",text:{ar:"هل بيانات المعرض على Google Maps محدّثة (الأوقات، العنوان، الصور)؟",en:"Is the store's Google Maps listing updated (hours, address, photos, phone number)?"}},
        {id:"m3.2",risk:"M",text:{ar:"هل منصات التواصل الاجتماعي المرتبطة بالمعرض نشطة ومحدّثة أسبوعياً؟",en:"Are store-linked social media platforms active and content updated at least weekly?"}},
        {id:"m3.3",risk:"L",text:{ar:"هل يتم توثيق العروض والفعاليات بصور وفيديوهات احترافية وتُنشر في الوقت المناسب؟",en:"Are offers and events documented with professional photos/videos and published timely?"}},
        {id:"m3.4",risk:"L",text:{ar:"هل قناة WhatsApp Business تُستخدم لإعلام العملاء المنتظمين بالعروض الحصرية؟",en:"Is WhatsApp Business used to notify regular customers about exclusive offers?"}},
      ]},
      { id:"mkt4", title:{ar:"تحليل الأداء التسويقي",en:"Marketing Performance Analysis"}, items:[
        {id:"m4.1",risk:"H",text:{ar:"هل يتم تتبع نسبة تحويل الزوار إلى مشترين (Conversion Rate) وتحليل أسباب الانخفاض؟",en:"Is the visitor-to-buyer conversion rate tracked and root causes analyzed when it drops?"}},
        {id:"m4.2",risk:"M",text:{ar:"هل يتم قياس فعالية الحملات بمقارنة المبيعات قبل وخلال وبعد الحملة؟",en:"Is campaign effectiveness measured by comparing sales before, during, and after each campaign?"}},
        {id:"m4.3",risk:"M",text:{ar:"هل يتوفر تقرير Fast & Slow Movers ويُستخدم في قرارات العرض والطلب؟",en:"Is a Fast & Slow Movers report available and used to inform display and ordering decisions?"}},
        {id:"m4.4",risk:"M",text:{ar:"هل يتم مراقبة أسعار وعروض المنافسين المجاورين ورفع تقرير دوري؟",en:"Are nearby competitors' prices and offers monitored with periodic reports submitted?"}},
      ]},
      { id:"mkt5", title:{ar:"التسويق الميداني وهوية المتجر البصرية",en:"In-Store Visual Identity & Field Marketing"}, items:[
        {id:"m5.1",risk:"M",text:{ar:"هل يتم تطبيق مخطط البلانوجرام المعتمد من قسم التسويق بدقة في جميع المعارض ومراجعته بعد كل حملة؟",en:"Is the marketing-approved planogram applied accurately across all stores and reviewed after each campaign?"}},
        {id:"m5.2",risk:"H",text:{ar:"هل هوية العلامة التجارية البصرية (الألوان، الخطوط، اللافتات) مطبقة بشكل موحد في جميع نقاط البيع دون انحراف؟",en:"Is the brand's visual identity (colors, fonts, signage) applied consistently across all POS without deviation?"}},
        {id:"m5.3",risk:"H",text:{ar:"هل مواد POS (لافتات العروض، علامات الأسعار، الإعلانات الداخلية) منسجمة مع الحملة الحالية ومحدّثة بالكامل؟",en:"Are POS materials (offer signage, price tags, in-store ads) aligned with the current campaign and fully updated?"}},
        {id:"m5.4",risk:"H",text:{ar:"هل يتم تطبيق أسعار العروض الترويجية على الأرفف والنظام في نفس وقت إطلاق الحملة دون تأخير؟",en:"Are promotional prices applied to shelves and system at the exact campaign launch time without delay?"}},
        {id:"m5.5",risk:"H",text:{ar:"هل تتم إزالة مواد العروض المنتهية (لافتات، ملصقات، علامات الأسعار) فورًا عند انتهاء مدة الحملة؟",en:"Are all expired campaign materials (banners, stickers, price tags) removed immediately upon campaign end?"}},
        {id:"m5.6",risk:"M",text:{ar:"هل المنتجات الموسمية ومنتجات المناسبات الوطنية معروضة بمواد ترويجية مناسبة قبل الموعد المحدد؟",en:"Are seasonal and national occasion products displayed with appropriate promotional materials before the set deadline?"}},
        {id:"m5.7",risk:"M",text:{ar:"هل نقاط الإضاءة التسليطية موجهة نحو المنتجات المميزة والعروض الرئيسية لتعزيز جاذبيتها البصرية؟",en:"Are spotlight fixtures directed toward featured products and key offers to enhance their visual appeal?"}},
        {id:"m5.8",risk:"M",text:{ar:"هل الممرات والمداخل تعكس هوية العلامة وتُوجّه العميل بصرياً نحو نقاط الاهتمام والعروض الرئيسية؟",en:"Do aisles and entrances reflect the brand identity and visually guide customers toward interest points and key offers?"}},
        {id:"m5.9",risk:"L",text:{ar:"هل يتم توثيق حالة المعرض البصرية بصور دورية (أسبوعية أو عند كل حملة) وإرسالها لقسم التسويق للمراجعة؟",en:"Is the store's visual state documented with periodic photos (weekly or per campaign) and submitted to marketing for review?"}},
      ]},
    ],
  },
];

// ─── HEAD OFFICE DEPARTMENTS ──────────────────────────────────────────────────
const HQ_DEPTS = [
  {
    id:"maint", icon:"🔧",
    label:{ar:"إدارة الصيانة",en:"Maintenance Management"},
    color:{bg:"bg-orange-600",light:"bg-orange-50",border:"border-orange-200",text:"text-orange-700"},
    sections:[
      { id:"mnt1", title:{ar:"الصيانة الوقائية والدورية",en:"Preventive & Periodic Maintenance"}, items:[
        {id:"mn1.1",risk:"H",text:{ar:"هل يوجد خطة صيانة وقائية سنوية شاملة معتمدة لجميع المعارض والمنشآت؟",en:"Is there a comprehensive approved annual preventive maintenance plan for all stores and facilities?"}},
        {id:"mn1.2",risk:"H",text:{ar:"هل يتم تنفيذ جداول الصيانة الدورية لأنظمة التكييف والتهوية (HVAC) وتوثيقها؟",en:"Are periodic maintenance schedules for HVAC systems executed and documented?"}},
        {id:"mn1.3",risk:"H",text:{ar:"هل يتم صيانة أنظمة الكهرباء والإضاءة وفق جداول دورية مع سجلات موثقة؟",en:"Are electrical and lighting systems maintained per periodic schedules with documented records?"}},
        {id:"mn1.4",risk:"M",text:{ar:"هل يتم إجراء فحص دوري للسلالم الكهربائية والمصاعد وطفايات الحريق مع توثيق النتائج؟",en:"Are periodic inspections of escalators, elevators, and fire extinguishers conducted with documented results?"}},
        {id:"mn1.5",risk:"M",text:{ar:"هل يتم صيانة واجهات المعارض ولافتات العلامة التجارية وتجديدها بشكل منتظم؟",en:"Are store facades and brand signage maintained and renewed on a regular basis?"}},
        {id:"mn1.6",risk:"L",text:{ar:"هل يتم فحص وصيانة أنظمة السباكة والعوازل بشكل دوري لتفادي الأعطال المفاجئة؟",en:"Are plumbing and insulation systems inspected periodically to prevent sudden failures?"}},
      ]},
      { id:"mnt2", title:{ar:"الصيانة التشغيلية والأجهزة",en:"Operational & Equipment Maintenance"}, items:[
        {id:"mn2.1",risk:"H",text:{ar:"هل يتم صيانة أجهزة الكاشير وقارئات الباركود والطابعات وفق جداول منتظمة مع عقود صيانة فعّالة؟",en:"Are cash registers, barcode readers, and printers maintained per regular schedules with active maintenance contracts?"}},
        {id:"mn2.2",risk:"H",text:{ar:"هل يوجد SLA واضح مع شركات الصيانة يحدد وقت الاستجابة للأعطال الحرجة (خلال 4 ساعات)؟",en:"Is there a clear SLA with maintenance companies specifying response time for critical failures (within 4 hours)?"}},
        {id:"mn2.3",risk:"M",text:{ar:"هل يتم تتبع جميع بلاغات الأعطال في نظام مركزي مع متابعة حالة الإغلاق والحل؟",en:"Are all malfunction reports tracked in a centralized system with closure and resolution status monitored?"}},
        {id:"mn2.4",risk:"M",text:{ar:"هل يتم توثيق تكاليف الصيانة ومقارنتها بالميزانية المخصصة شهرياً؟",en:"Are maintenance costs documented and compared to the allocated budget on a monthly basis?"}},
        {id:"mn2.5",risk:"H",text:{ar:"هل يتم فحص أنظمة مراقبة الكاميرات مركزياً والتحقق من جودة التسجيل والتخزين لمدة 90 يوماً؟",en:"Are surveillance camera systems centrally monitored with recording quality and 90-day storage verified?"}},
      ]},
      { id:"mnt3", title:{ar:"عقود الصيانة والموردون",en:"Maintenance Contracts & Vendors"}, items:[
        {id:"mn3.1",risk:"H",text:{ar:"هل جميع عقود الصيانة سارية المفعول ومراجعتها قبل انتهائها بـ 60 يوماً على الأقل؟",en:"Are all maintenance contracts valid and reviewed at least 60 days before expiry?"}},
        {id:"mn3.2",risk:"H",text:{ar:"هل يتم تقييم أداء شركات الصيانة بشكل ربعي ومقارنته بمعايير SLA المتفق عليها؟",en:"Is maintenance vendor performance evaluated quarterly and compared to agreed SLA standards?"}},
        {id:"mn3.3",risk:"M",text:{ar:"هل يوجد قائمة موردين معتمدين للصيانة الطارئة مع أرقام تواصل محدثة لكل معرض؟",en:"Is there an approved emergency maintenance vendor list with updated contact numbers for each store?"}},
        {id:"mn3.4",risk:"M",text:{ar:"هل يتم الاحتفاظ بقطع الغيار الحيوية في المخزن المركزي لتقليل وقت توقف الأجهزة؟",en:"Are critical spare parts stocked centrally to minimize equipment downtime?"}},
      ]},
    ],
  },
  {
    id:"proc", icon:"🛒",
    label:{ar:"المشتريات وسلسلة التوريد",en:"Procurement & Supply Chain"},
    color:{bg:"bg-teal-600",light:"bg-teal-50",border:"border-teal-200",text:"text-teal-700"},
    sections:[
      { id:"prc1", title:{ar:"سياسة المشتريات والموردون",en:"Procurement Policy & Vendors"}, items:[
        {id:"p1.1",risk:"H",text:{ar:"هل يوجد سياسة مشتريات موثقة ومعتمدة تحدد صلاحيات الشراء وحدود الموافقة لكل مستوى إداري؟",en:"Is there a documented approved procurement policy specifying purchasing authorities and approval limits per management level?"}},
        {id:"p1.2",risk:"H",text:{ar:"هل يوجد قائمة موردين معتمدين محدثة ويتم تقييمهم بشكل دوري وفق معايير الجودة والسعر والتسليم؟",en:"Is there an updated approved vendor list with vendors evaluated periodically per quality, price, and delivery criteria?"}},
        {id:"p1.3",risk:"H",text:{ar:"هل يتم الحصول على عروض أسعار متعددة (3 على الأقل) لأي مشتريات تتجاوز الحد المحدد؟",en:"Are multiple price quotes (minimum 3) obtained for any purchases exceeding the defined threshold?"}},
        {id:"p1.4",risk:"M",text:{ar:"هل يتم مراجعة أسعار الموردين الرئيسيين مقارنة بالسوق بشكل نصف سنوي لضمان التنافسية؟",en:"Are key vendor prices reviewed against market rates semi-annually to ensure competitiveness?"}},
        {id:"p1.5",risk:"H",text:{ar:"هل يتم التحقق من خلو عمليات المشتريات من تضارب المصالح وتوثيق ذلك رسمياً؟",en:"Are procurement processes verified to be free from conflicts of interest and formally documented?"}},
      ]},
      { id:"prc2", title:{ar:"دورة الطلب والاستلام",en:"Order & Receiving Cycle"}, items:[
        {id:"p2.1",risk:"H",text:{ar:"هل أوامر الشراء (PO) معتمدة من المستوى الإداري المناسب قبل إرسالها للمورد؟",en:"Are Purchase Orders (PO) approved by the appropriate management level before being sent to vendors?"}},
        {id:"p2.2",risk:"H",text:{ar:"هل يتم مطابقة البضاعة المستلمة مع أوامر الشراء من حيث الكميات والمواصفات والأسعار؟",en:"Is received merchandise matched against POs in terms of quantities, specifications, and prices?"}},
        {id:"p2.3",risk:"H",text:{ar:"هل يتم توثيق المخالفات في الاستلام والإبلاغ عنها للمورد خلال المدة المتفق عليها في العقد؟",en:"Are receiving discrepancies documented and reported to the vendor within the contractually agreed timeframe?"}},
        {id:"p2.4",risk:"M",text:{ar:"هل متوسط مدة دورة الطلب (Lead Time) ضمن المعيار المحدد ويتم تتبعه مع كل مورد؟",en:"Is the average order lead time within the defined standard and tracked for each vendor?"}},
        {id:"p2.5",risk:"M",text:{ar:"هل يتم مراجعة مستويات المخزون الآمن (Safety Stock) بشكل دوري ومقارنتها بالاستهلاك الفعلي؟",en:"Are safety stock levels reviewed periodically and compared to actual consumption?"}},
      ]},
      { id:"prc3", title:{ar:"إدارة العقود والتكاليف",en:"Contract & Cost Management"}, items:[
        {id:"p3.1",risk:"H",text:{ar:"هل يتم مراجعة جميع عقود الموردين قبل انتهائها ومفاوضة الشروط للحصول على أفضل الأسعار والخدمات؟",en:"Are all vendor contracts reviewed before expiry and terms renegotiated for best prices and services?"}},
        {id:"p3.2",risk:"H",text:{ar:"هل يتم تدقيق فواتير الموردين مقابل أوامر الشراء والعقود قبل الموافقة على الدفع؟",en:"Are vendor invoices audited against POs and contracts before payment approval?"}},
        {id:"p3.3",risk:"M",text:{ar:"هل يتم تتبع الوفورات التي تحققت من مفاوضات المشتريات وإدراجها في تقارير الأداء؟",en:"Are savings achieved from procurement negotiations tracked and included in performance reports?"}},
        {id:"p3.4",risk:"M",text:{ar:"هل يوجد خطة طوارئ للتوريد في حال توقف أحد الموردين الرئيسيين لضمان استمرارية التشغيل؟",en:"Is there a supply contingency plan in case a key vendor stops operations to ensure business continuity?"}},
      ]},
    ],
  },
  {
    id:"it", icon:"💻",
    label:{ar:"تقنية المعلومات والأنظمة",en:"IT & Systems"},
    color:{bg:"bg-indigo-600",light:"bg-indigo-50",border:"border-indigo-200",text:"text-indigo-700"},
    sections:[
      { id:"it1", title:{ar:"أمن المعلومات والبيانات",en:"Information Security & Data"}, items:[
        {id:"i1.1",risk:"H",text:{ar:"هل يوجد سياسة أمن معلومات موثقة ومعتمدة تغطي جميع جوانب الوصول والحماية؟",en:"Is there a documented approved information security policy covering all aspects of access and protection?"}},
        {id:"i1.2",risk:"H",text:{ar:"هل يتم مراجعة صلاحيات وصول المستخدمين للأنظمة بشكل ربعي وإلغاء الصلاحيات عند مغادرة الموظف فوراً؟",en:"Are user access rights to systems reviewed quarterly with permissions revoked immediately upon employee departure?"}},
        {id:"i1.3",risk:"H",text:{ar:"هل يتم تنفيذ نسخ احتياطية يومية لجميع البيانات الحيوية والتحقق من قابلية الاسترداد بشكل دوري؟",en:"Are daily backups of all critical data executed and restorability verified periodically?"}},
        {id:"i1.4",risk:"H",text:{ar:"هل يتم توثيق ومتابعة جميع حوادث اختراق البيانات أو المحاولات المشبوهة مع اتخاذ إجراءات فورية؟",en:"Are all data breach incidents or suspicious attempts documented, tracked, and met with immediate action?"}},
        {id:"i1.5",risk:"M",text:{ar:"هل يوجد سياسة واضحة لاستخدام الأجهزة والشبكات وهل يتم توعية الموظفين بها بشكل منتظم؟",en:"Is there a clear device and network usage policy and are employees regularly trained on it?"}},
      ]},
      { id:"it2", title:{ar:"أنظمة ERP وPOS",en:"ERP & POS Systems"}, items:[
        {id:"i2.1",risk:"H",text:{ar:"هل أنظمة ERP وPOS محدّثة بآخر الإصدارات مع تطبيق التحديثات الأمنية في الوقت المحدد؟",en:"Are ERP and POS systems updated to the latest versions with security patches applied on time?"}},
        {id:"i2.2",risk:"H",text:{ar:"هل يتم إجراء تدقيق دوري على سجلات النظام (Audit Logs) للكشف عن أي عمليات غير مصرح بها؟",en:"Are system audit logs periodically reviewed to detect any unauthorized operations?"}},
        {id:"i2.3",risk:"H",text:{ar:"هل يوجد خطة استمرارية أعمال (BCP) واضحة تحدد إجراءات التشغيل عند تعطل الأنظمة الرئيسية؟",en:"Is there a clear Business Continuity Plan (BCP) defining operational procedures when main systems fail?"}},
        {id:"i2.4",risk:"M",text:{ar:"هل يتم قياس وقت تشغيل الأنظمة (Uptime) وتتبع حوادث الانقطاع وتحليل أسبابها؟",en:"Is system uptime measured and downtime incidents tracked with root cause analysis performed?"}},
        {id:"i2.5",risk:"M",text:{ar:"هل يتم تقديم تدريب دوري للمستخدمين الجدد والحاليين على الأنظمة والتحديثات الجديدة؟",en:"Is periodic training provided to both new and existing users on systems and new updates?"}},
      ]},
      { id:"it3", title:{ar:"البنية التحتية والشبكات",en:"Infrastructure & Networks"}, items:[
        {id:"i3.1",risk:"H",text:{ar:"هل شبكة الإنترنت في جميع المعارض مستقرة ومحمية بجدار ناري (Firewall) محدّث؟",en:"Is the internet network in all stores stable and protected by an updated firewall?"}},
        {id:"i3.2",risk:"M",text:{ar:"هل يتم فصل شبكة الموظفين عن شبكة العملاء (Guest WiFi) لضمان الأمان؟",en:"Is the staff network separated from the customer/guest WiFi to ensure security?"}},
        {id:"i3.3",risk:"M",text:{ar:"هل يتم مراجعة عقود مزودي خدمة الإنترنت والاتصالات بشكل سنوي لضمان أفضل الخدمات والأسعار؟",en:"Are internet and telecommunications service contracts reviewed annually to ensure best services and prices?"}},
        {id:"i3.4",risk:"H",text:{ar:"هل يوجد اتصال احتياطي (Backup Connection) في كل معرض لضمان الاستمرارية عند انقطاع الخدمة الرئيسية؟",en:"Is there a backup connection in each store to ensure continuity when the primary service is interrupted?"}},
      ]},
    ],
  },
  {
    id:"qual", icon:"✅",
    label:{ar:"الجودة والامتثال التنظيمي",en:"Quality & Regulatory Compliance"},
    color:{bg:"bg-cyan-600",light:"bg-cyan-50",border:"border-cyan-200",text:"text-cyan-700"},
    sections:[
      { id:"ql1", title:{ar:"الامتثال للأنظمة والتشريعات",en:"Regulatory & Legislative Compliance"}, items:[
        {id:"q1.1",risk:"H",text:{ar:"هل يتم تتبع التغييرات في الأنظمة والتشريعات التجارية والعمالية وتحديث السياسات الداخلية وفقاً لها؟",en:"Are changes in commercial and labor regulations tracked and internal policies updated accordingly?"}},
        {id:"q1.2",risk:"H",text:{ar:"هل جميع التراخيص التجارية ورخص الدفاع المدني وشهادات الجودة لكل معرض سارية وتجدّد قبل انتهائها بـ 90 يوماً؟",en:"Are all commercial licenses, civil defense permits, and quality certificates valid and renewed 90 days before expiry?"}},
        {id:"q1.3",risk:"H",text:{ar:"هل يتم إجراء تدقيق امتثال داخلي دوري (ربعي) مستقل عن الإدارة التشغيلية؟",en:"Is a periodic internal compliance audit (quarterly) conducted independently from operational management?"}},
        {id:"q1.4",risk:"M",text:{ar:"هل يوجد سجل موثق لجميع المخالفات التنظيمية التي صدرت بحق الشركة مع خطط تصحيح منفذة؟",en:"Is there a documented record of all regulatory violations issued against the company with implemented corrective plans?"}},
        {id:"q1.5",risk:"H",text:{ar:"هل تلتزم الشركة بمتطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) من حيث الفوترة الإلكترونية والتوثيق؟",en:"Does the company comply with ZATCA requirements including e-invoicing and documentation?"}},
      ]},
      { id:"ql2", title:{ar:"معايير الجودة والإجراءات",en:"Quality Standards & Procedures"}, items:[
        {id:"q2.1",risk:"H",text:{ar:"هل يوجد دليل إجراءات تشغيل موحدة (SOPs) شاملاً ومحدثاً لجميع العمليات الرئيسية؟",en:"Is there a comprehensive and updated Standard Operating Procedures (SOPs) manual for all key operations?"}},
        {id:"q2.2",risk:"H",text:{ar:"هل يتم مراجعة وتحديث السياسات والإجراءات الداخلية بشكل سنوي أو عند حدوث تغييرات جوهرية؟",en:"Are internal policies and procedures reviewed and updated annually or upon material changes?"}},
        {id:"q2.3",risk:"M",text:{ar:"هل يوجد نظام لإدارة الشكاوى والمقترحات يضمن التحليل الجذري والتحسين المستمر؟",en:"Is there a complaint and suggestion management system ensuring root cause analysis and continuous improvement?"}},
        {id:"q2.4",risk:"M",text:{ar:"هل يتم قياس KPIs الرئيسية لكل قسم وإدراجها في تقارير دورية تُعرض على الإدارة العليا؟",en:"Are key KPIs for each department measured and included in periodic reports presented to senior management?"}},
        {id:"q2.5",risk:"M",text:{ar:"هل يوجد منهجية واضحة لإدارة المشاريع والمبادرات الاستراتيجية مع تتبع الإنجاز ومؤشرات الأداء؟",en:"Is there a clear methodology for managing strategic projects and initiatives with progress tracking and KPIs?"}},
      ]},
      { id:"ql3", title:{ar:"إدارة المخاطر والتدقيق الداخلي",en:"Risk Management & Internal Audit"}, items:[
        {id:"q3.1",risk:"H",text:{ar:"هل يوجد إطار رسمي لإدارة المخاطر يغطي المخاطر التشغيلية والمالية والامتثالية لكل الأنشطة؟",en:"Is there a formal risk management framework covering operational, financial, and compliance risks for all activities?"}},
        {id:"q3.2",risk:"H",text:{ar:"هل يتم تحديث سجل المخاطر بشكل ربعي مع تقييم الاحتمالية والتأثير وخطط المعالجة لكل خطر؟",en:"Is the risk register updated quarterly with probability and impact assessments and mitigation plans for each risk?"}},
        {id:"q3.3",risk:"H",text:{ar:"هل يوجد فريق تدقيق داخلي مستقل يعمل وفق خطة تدقيق سنوية معتمدة من مجلس الإدارة؟",en:"Is there an independent internal audit team operating per an annual audit plan approved by the Board?"}},
        {id:"q3.4",risk:"H",text:{ar:"هل يتم متابعة نتائج وتوصيات التدقيق السابقة والتحقق من تنفيذ خطط المعالجة في المواعيد المحددة؟",en:"Are previous audit findings and recommendations followed up and corrective plans verified for timely implementation?"}},
        {id:"q3.5",risk:"M",text:{ar:"هل يوجد سياسة الإبلاغ عن المخالفات (Whistleblowing Policy) تضمن حماية المبلغين وسرية البلاغات؟",en:"Is there a Whistleblowing Policy ensuring reporter protection and report confidentiality?"}},
      ]},
    ],
  },
  {
    id:"sfin", icon:"📈",
    label:{ar:"المالية الاستراتيجية",en:"Strategic Finance"},
    color:{bg:"bg-green-700",light:"bg-green-50",border:"border-green-200",text:"text-green-800"},
    sections:[
      { id:"sf1", title:{ar:"التخطيط المالي والميزانية",en:"Financial Planning & Budgeting"}, items:[
        {id:"sf1.1",risk:"H",text:{ar:"هل يتم إعداد الميزانية السنوية وفق منهجية Zero-Based Budgeting أو ما يعادلها مع ربطها بالأهداف الاستراتيجية؟",en:"Is the annual budget prepared using Zero-Based Budgeting or equivalent methodology linked to strategic objectives?"}},
        {id:"sf1.2",risk:"H",text:{ar:"هل يتم مراجعة أداء الميزانية مقابل الفعلي (Budget vs Actual) شهرياً مع تحليل الانحرافات وخطط التصحيح؟",en:"Is budget vs. actual performance reviewed monthly with variance analysis and corrective plans?"}},
        {id:"sf1.3",risk:"H",text:{ar:"هل يتم إعداد توقعات مالية متجددة (Rolling Forecast) كل ربع سنة لتعديل الخطة وفق المستجدات؟",en:"Are rolling financial forecasts prepared quarterly to adjust the plan based on current developments?"}},
        {id:"sf1.4",risk:"M",text:{ar:"هل يتم تحليل نقطة التعادل (Break-Even Analysis) لكل معرض بشكل سنوي لاتخاذ قرارات التوسع أو الإغلاق؟",en:"Is Break-Even Analysis conducted for each store annually to support expansion or closure decisions?"}},
        {id:"sf1.5",risk:"M",text:{ar:"هل يتم وضع سيناريوهات مالية متعددة (Best / Base / Worst Case) عند التخطيط للمشاريع الكبيرة؟",en:"Are multiple financial scenarios (Best / Base / Worst Case) modeled when planning major projects?"}},
      ]},
      { id:"sf2", title:{ar:"المؤشرات المالية الاستراتيجية",en:"Strategic Financial KPIs"}, items:[
        {id:"sf2.1",risk:"H",text:{ar:"هل يتم قياس وتتبع هامش الربح الإجمالي (Gross Margin %) لكل معرض وكل فئة منتجات بشكل شهري؟",en:"Is Gross Margin % measured and tracked per store and per product category on a monthly basis?"}},
        {id:"sf2.2",risk:"H",text:{ar:"هل يتم قياس العائد على الاستثمار (ROI) لكل معرض ومقارنته بتكلفة رأس المال المستخدم؟",en:"Is Return on Investment (ROI) measured per store and compared to the cost of capital employed?"}},
        {id:"sf2.3",risk:"H",text:{ar:"هل يتم تتبع مؤشر المبيعات لكل متر مربع (Sales per SQM) كمعيار لكفاءة استغلال المساحة؟",en:"Is Sales per Square Meter tracked as a key efficiency metric for space utilization?"}},
        {id:"sf2.4",risk:"M",text:{ar:"هل يتم مراقبة نسب السيولة (Current Ratio, Quick Ratio) للتحقق من قدرة الشركة على الوفاء بالتزاماتها قصيرة الأجل؟",en:"Are liquidity ratios (Current Ratio, Quick Ratio) monitored to verify the company's ability to meet short-term obligations?"}},
        {id:"sf2.5",risk:"M",text:{ar:"هل يتم قياس دورة تحويل النقد (Cash Conversion Cycle) وتحسينها لتعزيز التدفق النقدي التشغيلي؟",en:"Is the Cash Conversion Cycle measured and optimized to enhance operational cash flow?"}},
        {id:"sf2.6",risk:"H",text:{ar:"هل يتم إعداد تقرير EBITDA شهري يوضح الأداء التشغيلي الحقيقي مستقلاً عن قرارات التمويل والمحاسبة؟",en:"Is a monthly EBITDA report prepared to reflect true operational performance independent of financing and accounting decisions?"}},
      ]},
      { id:"sf3", title:{ar:"إدارة التدفقات النقدية والديون",en:"Cash Flow & Debt Management"}, items:[
        {id:"sf3.1",risk:"H",text:{ar:"هل يتم إعداد توقعات التدفق النقدي (Cash Flow Forecast) لـ 13 أسبوعاً على الأقل لضمان السيولة التشغيلية؟",en:"Is a 13-week Cash Flow Forecast prepared at minimum to ensure operational liquidity?"}},
        {id:"sf3.2",risk:"H",text:{ar:"هل يتم إدارة الذمم المدينة (Receivables) بفاعلية مع تتبع الأيام المعلقة (DSO) وإجراءات التحصيل؟",en:"Are Accounts Receivable managed effectively with Days Sales Outstanding (DSO) tracked and collection procedures active?"}},
        {id:"sf3.3",risk:"H",text:{ar:"هل تلتزم الشركة بشروط الدفع المتفق عليها مع الموردين مع الاستفادة من الخصومات المبكرة متى أمكن؟",en:"Does the company comply with agreed vendor payment terms while taking advantage of early payment discounts when possible?"}},
        {id:"sf3.4",risk:"H",text:{ar:"هل نسبة الدين إلى حقوق الملكية (Debt-to-Equity Ratio) ضمن الحدود المقبولة وفق سياسة الشركة وشروط المقرضين؟",en:"Is the Debt-to-Equity Ratio within acceptable limits per company policy and lender covenants?"}},
        {id:"sf3.5",risk:"M",text:{ar:"هل يتم مراجعة شروط التسهيلات الائتمانية والقروض البنكية سنوياً للتفاوض على أفضل الأسعار والشروط؟",en:"Are credit facility and bank loan terms reviewed annually to negotiate best rates and conditions?"}},
      ]},
      { id:"sf4", title:{ar:"التقارير المالية والحوكمة",en:"Financial Reporting & Governance"}, items:[
        {id:"sf4.1",risk:"H",text:{ar:"هل يتم إعداد القوائم المالية الشهرية (P&L، الميزانية العمومية، التدفق النقدي) في الموعد المحدد وترفع للإدارة العليا؟",en:"Are monthly financial statements (P&L, Balance Sheet, Cash Flow) prepared on time and submitted to senior management?"}},
        {id:"sf4.2",risk:"H",text:{ar:"هل تتم مراجعة القوائم المالية السنوية من قبل مدقق خارجي مستقل معتمد وتُقدَّم النتائج لمجلس الإدارة؟",en:"Are annual financial statements reviewed by an independent certified external auditor with findings presented to the Board?"}},
        {id:"sf4.3",risk:"H",text:{ar:"هل تلتزم الشركة بمعايير المحاسبة المعتمدة (IFRS أو GAAP) في إعداد قوائمها المالية؟",en:"Does the company comply with approved accounting standards (IFRS or GAAP) in preparing financial statements?"}},
        {id:"sf4.4",risk:"H",text:{ar:"هل يتم الإبلاغ الفوري للإدارة العليا ومجلس الإدارة عن أي مخاطر مالية جوهرية أو انحرافات كبيرة عن الأهداف؟",en:"Are significant financial risks or major deviations from targets immediately reported to senior management and the Board?"}},
        {id:"sf4.5",risk:"M",text:{ar:"هل يوجد لجنة مراجعة مالية تعقد اجتماعات منتظمة لمراجعة الأداء المالي واعتماد السياسات المالية؟",en:"Is there a finance review committee holding regular meetings to review financial performance and approve financial policies?"}},
      ]},
    ],
  },
  {
    id:"shrm", icon:"🎯",
    label:{ar:"الموارد البشرية الاستراتيجية",en:"Strategic HR"},
    color:{bg:"bg-purple-700",light:"bg-purple-50",border:"border-purple-200",text:"text-purple-800"},
    sections:[
      { id:"sh1", title:{ar:"استراتيجية القوى العاملة والتخطيط",en:"Workforce Strategy & Planning"}, items:[
        {id:"sh1.1",risk:"H",text:{ar:"هل يوجد خطة قوى عاملة (Workforce Plan) لثلاث سنوات مرتبطة بخطة التوسع التجاري ومتطلبات السعودة؟",en:"Is there a 3-year Workforce Plan linked to the commercial expansion plan and Saudization requirements?"}},
        {id:"sh1.2",risk:"H",text:{ar:"هل يتم مراجعة الهيكل التنظيمي سنوياً للتحقق من ملاءمته لأهداف الشركة وحجم الأعمال الحالي؟",en:"Is the organizational structure reviewed annually to verify its alignment with company objectives and current business size?"}},
        {id:"sh1.3",risk:"H",text:{ar:"هل تلتزم الشركة بخطة التوطين (نطاقات) وهل يوجد استراتيجية واضحة لتحقيق أعلى تصنيف ممكن؟",en:"Does the company comply with Saudization (Nitaqat) plans and is there a clear strategy to achieve the highest possible rating?"}},
        {id:"sh1.4",risk:"M",text:{ar:"هل يتم تحليل فجوات المهارات (Skills Gap Analysis) بشكل سنوي ويُبنى على أساسه خطة التدريب والتطوير؟",en:"Is a Skills Gap Analysis conducted annually with training and development plans built on its findings?"}},
        {id:"sh1.5",risk:"M",text:{ar:"هل يتم قياس تكلفة الموارد البشرية كنسبة من المبيعات ومقارنتها بمعايير القطاع للتحكم في الكفاءة؟",en:"Is HR cost as a percentage of sales measured and benchmarked against industry standards to control efficiency?"}},
      ]},
      { id:"sh2", title:{ar:"الاستقطاب والاختيار",en:"Talent Acquisition & Selection"}, items:[
        {id:"sh2.1",risk:"H",text:{ar:"هل يوجد إجراءات موحدة وموثقة للتوظيف تضمن الموضوعية وتمنع التمييز في جميع مراحل الاختيار؟",en:"Are there unified documented recruitment procedures ensuring objectivity and preventing discrimination across all selection stages?"}},
        {id:"sh2.2",risk:"H",text:{ar:"هل يتم قياس متوسط وقت شغل الوظائف الشاغرة (Time-to-Fill) وهل هو ضمن المعيار المحدد؟",en:"Is the average Time-to-Fill for vacancies measured and within the defined standard?"}},
        {id:"sh2.3",risk:"M",text:{ar:"هل يتم قياس تكلفة التوظيف لكل موظف (Cost-per-Hire) ومقارنتها بالميزانية والمعايير القطاعية؟",en:"Is the Cost-per-Hire measured and compared to budget and industry benchmarks?"}},
        {id:"sh2.4",risk:"M",text:{ar:"هل يتم توثيق جودة التوظيف (Quality of Hire) من خلال متابعة أداء الموظفين الجدد بعد 3 و6 أشهر من التعيين؟",en:"Is Quality of Hire documented by tracking new employee performance at 3 and 6 months post-hire?"}},
        {id:"sh2.5",risk:"H",text:{ar:"هل يتم التحقق من مراجع الموظفين الجدد وخلو سجلاتهم من المخالفات قبل التعيين الرسمي؟",en:"Are references verified and backgrounds checked for new employees prior to official appointment?"}},
      ]},
      { id:"sh3", title:{ar:"إدارة الأداء والمكافآت",en:"Performance Management & Rewards"}, items:[
        {id:"sh3.1",risk:"H",text:{ar:"هل يوجد إطار إدارة أداء رسمي يربط أهداف الموظفين بالأهداف الاستراتيجية للشركة بشكل واضح وقابل للقياس؟",en:"Is there a formal performance management framework linking employee goals to company strategic objectives in a clear and measurable way?"}},
        {id:"sh3.2",risk:"H",text:{ar:"هل هيكل الرواتب والمزايا تنافسي مقارنة بالسوق ويتم مراجعته سنوياً وفق دراسة رواتب محدّثة؟",en:"Is the salary and benefits structure competitive vs. market and reviewed annually per an updated salary survey?"}},
        {id:"sh3.3",risk:"H",text:{ar:"هل يتم صرف الرواتب والعلاوات والمكافآت في مواعيدها المحددة وبالكميات الصحيحة وفق مسير الرواتب المعتمد؟",en:"Are salaries, allowances, and bonuses disbursed on time and in correct amounts per the approved payroll?"}},
        {id:"sh3.4",risk:"M",text:{ar:"هل يوجد نظام حوافز متغير (Variable Pay) مرتبط بالأداء الفردي والجماعي يشجع على تحقيق الأهداف؟",en:"Is there a Variable Pay system linked to individual and team performance that incentivizes goal achievement?"}},
        {id:"sh3.5",risk:"M",text:{ar:"هل يتم مراجعة التوزيع الجغرافي للرواتب (Pay Distribution) للتحقق من العدالة الداخلية بين الموظفين في نفس الدرجة؟",en:"Is salary distribution reviewed for internal equity among employees at the same grade?"}},
      ]},
      { id:"sh4", title:{ar:"التطوير والتخطيط الوظيفي",en:"Development & Career Planning"}, items:[
        {id:"sh4.1",risk:"H",text:{ar:"هل يوجد خطة تعاقب وظيفية (Succession Plan) للمناصب الحيوية تضمن استمرارية القيادة وتقلل مخاطر الاعتماد على أفراد بعينهم؟",en:"Is there a Succession Plan for critical positions ensuring leadership continuity and reducing key-person dependency risk?"}},
        {id:"sh4.2",risk:"H",text:{ar:"هل يوجد برامج تطوير قيادي (Leadership Development) فعّالة تُعِدّ الكوادر الواعدة لتولي المناصب الإدارية مستقبلاً؟",en:"Are effective Leadership Development programs in place preparing high-potential staff for future management roles?"}},
        {id:"sh4.3",risk:"M",text:{ar:"هل يتم تحديد الموظفين ذوي الإمكانات العالية (High Potentials) رسمياً وتقديم مسارات تطوير مخصصة لهم؟",en:"Are High Potential employees formally identified and provided with tailored development pathways?"}},
        {id:"sh4.4",risk:"M",text:{ar:"هل يتم قياس العائد على الاستثمار في التدريب (Training ROI) لضمان أن برامج التطوير تحقق أثراً ملموساً على الأداء؟",en:"Is Training ROI measured to ensure development programs produce a tangible impact on performance?"}},
        {id:"sh4.5",risk:"M",text:{ar:"هل يوجد برنامج فعّال للتوجيه والإرشاد (Mentoring & Coaching) يربط القيادات بالموظفين الواعدين؟",en:"Is there an effective Mentoring & Coaching program linking leadership with high-potential employees?"}},
      ]},
      { id:"sh5", title:{ar:"مشاركة الموظفين وثقافة العمل",en:"Employee Engagement & Culture"}, items:[
        {id:"sh5.1",risk:"H",text:{ar:"هل يتم إجراء استطلاع مشاركة الموظفين (Employee Engagement Survey) بشكل سنوي وتُتخذ إجراءات فعلية بناءً على النتائج؟",en:"Is an Employee Engagement Survey conducted annually with actual actions taken based on results?"}},
        {id:"sh5.2",risk:"H",text:{ar:"هل معدل دوران الموظفين (Turnover) يتم تحليله حسب القسم والمسمى والسبب لفهم جذور المشكلة ومعالجتها؟",en:"Is employee turnover analyzed by department, title, and reason to understand root causes and address them?"}},
        {id:"sh5.3",risk:"M",text:{ar:"هل قيم الشركة وثقافتها التنظيمية موثقة ومُعاشة فعلياً في بيئة العمل وليس مجرد شعارات معلقة؟",en:"Are the company's values and organizational culture documented and genuinely lived in the work environment rather than just posted slogans?"}},
        {id:"sh5.4",risk:"M",text:{ar:"هل يوجد برامج رعاية الموظفين (Employee Wellbeing) تشمل الصحة النفسية والجسدية والتوازن بين العمل والحياة؟",en:"Are Employee Wellbeing programs in place covering mental health, physical health, and work-life balance?"}},
        {id:"sh5.5",risk:"L",text:{ar:"هل يتم الاحتفال بإنجازات الموظفين وتكريمهم بشكل منتظم بما يعزز الانتماء والولاء للمؤسسة؟",en:"Are employee achievements celebrated and recognized regularly to reinforce belonging and organizational loyalty?"}},
      ]},
    ],
  },
  {
    id:"wh", icon:"🏭",
    label:{ar:"تدقيق المستودعات",en:"Warehouse Audit"},
    color:{bg:"bg-yellow-700",light:"bg-yellow-50",border:"border-yellow-300",text:"text-yellow-800"},
    sections:[
      { id:"wh1", title:{ar:"البنية التحتية والسلامة",en:"Infrastructure & Safety"}, items:[
        {id:"wh1.1",risk:"H",text:{ar:"هل يتم الالتزام بتعليمات الدفاع المدني ومتطلبات السلامة في المستودع من حيث الممرات ومخارج الطوارئ وعلامات التحذير؟",en:"Is compliance maintained with civil defense instructions and safety requirements including aisles, emergency exits, and warning signs?"}},
        {id:"wh1.2",risk:"H",text:{ar:"هل تغطي كاميرات المراقبة جميع مناطق المستودع بما فيها مناطق الاستقبال والشحن والتخزين ومخارج الموظفين؟",en:"Do surveillance cameras cover all warehouse areas including receiving, shipping, storage, and staff exits?"}},
        {id:"wh1.3",risk:"H",text:{ar:"هل طفايات الحريق صالحة وموزعة وفق المخطط المعتمد وهل نظام الإنذار المبكر يعمل بشكل صحيح؟",en:"Are fire extinguishers valid and distributed per the approved layout, and is the early warning system functioning correctly?"}},
        {id:"wh1.4",risk:"H",text:{ar:"هل يتم تخزين المواد القابلة للاشتعال أو الخطرة في أماكن مخصصة ومعزولة وفق اشتراطات السلامة؟",en:"Are flammable or hazardous materials stored in designated and isolated areas per safety requirements?"}},
        {id:"wh1.5",risk:"M",text:{ar:"هل الإضاءة كافية في جميع مناطق المستودع وهل يتم صيانتها بشكل دوري لضمان بيئة عمل آمنة؟",en:"Is lighting adequate throughout all warehouse areas and maintained periodically to ensure a safe working environment?"}},
        {id:"wh1.6",risk:"M",text:{ar:"هل درجة حرارة المستودع مناسبة لطبيعة البضائع المخزنة وهل يتم مراقبتها وتسجيلها يومياً؟",en:"Is the warehouse temperature appropriate for the nature of stored goods and monitored and recorded daily?"}},
        {id:"wh1.7",risk:"H",text:{ar:"هل نظام التحكم في الدخول للمستودع (بطاقات، بصمة، مفاتيح) فعّال ومقتصر على الموظفين المخوّلين فقط؟",en:"Is the warehouse access control system (cards, biometrics, keys) effective and restricted to authorized personnel only?"}},
      ]},
      { id:"wh2", title:{ar:"الاستلام والشحن",en:"Receiving & Shipping"}, items:[
        {id:"wh2.1",risk:"H",text:{ar:"هل يتم مطابقة كل شحنة واردة مع أمر الشراء (PO) والفاتورة من حيث الكميات والأصناف والحالة قبل التوقيع؟",en:"Is every inbound shipment matched against the PO and invoice for quantities, items, and condition before signing?"}},
        {id:"wh2.2",risk:"H",text:{ar:"هل يتم تسجيل جميع عمليات الاستلام في النظام في نفس يوم الوصول دون تأخير؟",en:"Are all receiving operations entered into the system on the same day of arrival without delay?"}},
        {id:"wh2.3",risk:"H",text:{ar:"هل يتم توثيق المخالفات (نقص، زيادة، تلف) فورًا وإشعار الجهات المعنية (مورد، مشتريات، مالية) في نفس اليوم؟",en:"Are discrepancies (shortage, excess, damage) documented immediately and relevant parties (vendor, procurement, finance) notified the same day?"}},
        {id:"wh2.4",risk:"H",text:{ar:"هل يتم التحقق من الشحنات الصادرة للمعارض مع أوامر التحويل قبل المغادرة ويوقّع عليها من موظف مفوّض؟",en:"Are outbound shipments to stores verified against transfer orders before departure and signed off by an authorized employee?"}},
        {id:"wh2.5",risk:"H",text:{ar:"هل يتم توثيق وتتبع جميع التحويلات بين المعارض والمستودع في النظام مع تأكيد استلام الطرف المستقبل خلال 48 ساعة؟",en:"Are all inter-store and warehouse transfers tracked in the system with receiving party confirmation within 48 hours?"}},
        {id:"wh2.6",risk:"M",text:{ar:"هل يتم قياس دقة الشحنات الصادرة (Order Accuracy %) بشكل دوري وهي ضمن المعيار المستهدف؟",en:"Is outbound order accuracy (Order Accuracy %) measured periodically and within the targeted standard?"}},
      ]},
      { id:"wh3", title:{ar:"إدارة المخزون والتخزين",en:"Inventory Management & Storage"}, items:[
        {id:"wh3.1",risk:"H",text:{ar:"هل يتم تطبيق نظام FIFO بصرامة لجميع الأصناف وخاصة ذات التواريخ لضمان عدم تراكم المواد القديمة؟",en:"Is FIFO strictly applied for all SKUs especially dated items to ensure no accumulation of old stock?"}},
        {id:"wh3.2",risk:"H",text:{ar:"هل مستويات المخزون الفعلية في المستودع مطابقة لما هو مسجل في النظام ويتم التحقق منها بالجرد الدوري؟",en:"Are actual inventory levels in the warehouse matching system records and verified through periodic counts?"}},
        {id:"wh3.3",risk:"H",text:{ar:"هل يتم إجراء جرد شامل للمستودع بشكل ربعي على الأقل ومراجعة نتائجه مع الإدارة المالية؟",en:"Is a full warehouse count conducted at least quarterly with results reviewed with financial management?"}},
        {id:"wh3.4",risk:"H",text:{ar:"هل نسبة الانكماش في المستودع (Shrinkage %) ضمن الهدف المحدد وهل توجد خطة عمل للتحكم فيها؟",en:"Is warehouse shrinkage within the defined target and is there an action plan to control it?"}},
        {id:"wh3.5",risk:"M",text:{ar:"هل يتم تتبع معدل دوران المخزون (Inventory Turnover) في المستودع ومقارنته بالهدف لتحديد البضائع الراكدة؟",en:"Is Inventory Turnover tracked for the warehouse and compared to target to identify slow-moving and dead stock?"}},
        {id:"wh3.6",risk:"M",text:{ar:"هل البضائع مصنّفة وموضوعة في أماكن ثابتة ومحددة (Fixed Locations) داخل المستودع مع خرائط تخزين محدّثة؟",en:"Are goods categorized and stored in fixed designated locations within the warehouse with updated storage maps?"}},
        {id:"wh3.7",risk:"M",text:{ar:"هل يتم فصل البضائع التالفة والمرتجعة في منطقة معزولة ومعلّمة ويتم معالجتها وفق السياسة المعتمدة؟",en:"Are damaged and returned goods kept in a separate labeled area and handled per the approved policy?"}},
        {id:"wh3.8",risk:"H",text:{ar:"هل يتم تتبع المنتجات منتهية الصلاحية أو قاربت على الانتهاء في المستودع وإشعار الإدارة المعنية لاتخاذ إجراء؟",en:"Are expired or near-expiry products in the warehouse tracked and relevant management notified to take action?"}},
      ]},
      { id:"wh4", title:{ar:"الكوادر البشرية والإنتاجية",en:"Workforce & Productivity"}, items:[
        {id:"wh4.1",risk:"H",text:{ar:"هل يتمتع موظفو المستودع بالتدريب الكافي على أنظمة إدارة المستودع (WMS) وإجراءات الاستلام والشحن؟",en:"Do warehouse staff have sufficient training on Warehouse Management Systems (WMS) and receiving/shipping procedures?"}},
        {id:"wh4.2",risk:"H",text:{ar:"هل يتم تطبيق إجراءات تفتيش الموظفين عند الدخول والخروج من المستودع بشكل منتظم لمنع السرقة؟",en:"Are staff inspection procedures upon entering and exiting the warehouse applied regularly to prevent theft?"}},
        {id:"wh4.3",risk:"M",text:{ar:"هل يتم قياس إنتاجية موظفي المستودع (وحدات معالجة/ساعة) وتتبعها مقارنة بالهدف؟",en:"Is warehouse staff productivity (units processed/hour) measured and tracked against target?"}},
        {id:"wh4.4",risk:"M",text:{ar:"هل توزيع المهام داخل المستودع واضح ومحدد لكل موظف ولا يوجد تداخل أو إهمال في المسؤوليات؟",en:"Is task allocation within the warehouse clearly defined per employee with no overlap or neglect of responsibilities?"}},
        {id:"wh4.5",risk:"M",text:{ar:"هل يتم تنفيذ اجتماعات يومية قصيرة (Daily Stand-up) مع فريق المستودع لمتابعة الأهداف والتحديات التشغيلية؟",en:"Are brief daily stand-up meetings held with the warehouse team to review objectives and operational challenges?"}},
      ]},
      { id:"wh5", title:{ar:"الأنظمة والتقارير",en:"Systems & Reporting"}, items:[
        {id:"wh5.1",risk:"H",text:{ar:"هل نظام إدارة المستودع (WMS) أو ERP محدّث ويعكس الحركات الفعلية للبضائع بشكل آني أو شبه آني؟",en:"Is the WMS or ERP system updated and reflecting actual goods movements in real-time or near-real-time?"}},
        {id:"wh5.2",risk:"H",text:{ar:"هل يتم رفع تقرير يومي لحركة المستودع (الوارد والصادر والرصيد) للإدارة المعنية في الموعد المحدد؟",en:"Is a daily warehouse movement report (inbound, outbound, balance) submitted to relevant management on time?"}},
        {id:"wh5.3",risk:"M",text:{ar:"هل يتم رصد مساحة التخزين المستخدمة (Space Utilization %) وتحسينها بشكل دوري لتعظيم كفاءة المستودع؟",en:"Is storage space utilization (Space Utilization %) monitored and periodically optimized to maximize warehouse efficiency?"}},
        {id:"wh5.4",risk:"M",text:{ar:"هل يتم تتبع مؤشر دقة المخزون (Inventory Accuracy %) بعد كل جرد والعمل على تحسينه باستمرار؟",en:"Is Inventory Accuracy % tracked after every count and continuously worked on for improvement?"}},
        {id:"wh5.5",risk:"M",text:{ar:"هل يتم تتبع متوسط وقت معالجة الشحنات الواردة والصادرة (Processing Time) ومقارنته بالمعيار المستهدف؟",en:"Is the average processing time for inbound and outbound shipments tracked and compared to the targeted standard?"}},
      ]},
    ],
  },
  {
    id:"smkt", icon:"🚀",
    label:{ar:"التسويق الاستراتيجي والمرشنديزينج",en:"Strategic Marketing & Merchandising"},
    color:{bg:"bg-pink-600",light:"bg-pink-50",border:"border-pink-200",text:"text-pink-700"},
    sections:[
      { id:"sm1", title:{ar:"الاستراتيجية التسويقية والعلامة التجارية",en:"Marketing Strategy & Brand Management"}, items:[
        {id:"sm1.1",risk:"H",text:{ar:"هل يوجد استراتيجية تسويقية سنوية موثقة ومعتمدة من الإدارة العليا تحدد الأهداف والجمهور المستهدف والميزانية؟",en:"Is there a documented annual marketing strategy approved by senior management defining objectives, target audience, and budget?"}},
        {id:"sm1.2",risk:"H",text:{ar:"هل هوية العلامة التجارية (Brand Identity) محددة بوضوح في دليل هوية معتمد (Brand Book) ويتم تطبيقها بشكل موحد في جميع القنوات؟",en:"Is the Brand Identity clearly defined in an approved Brand Book and applied consistently across all channels?"}},
        {id:"sm1.3",risk:"H",text:{ar:"هل يتم قياس صحة العلامة التجارية (Brand Health) بشكل دوري من خلال استطلاعات الوعي والتفضيل وتحليل النتائج؟",en:"Is Brand Health measured periodically through awareness and preference surveys with results analyzed?"}},
        {id:"sm1.4",risk:"M",text:{ar:"هل يتم إجراء تحليل تنافسي منتظم (Competitive Analysis) لفهم موقع العلامة في السوق مقارنة بالمنافسين الرئيسيين؟",en:"Is a regular Competitive Analysis conducted to understand the brand's market positioning vs. key competitors?"}},
        {id:"sm1.5",risk:"M",text:{ar:"هل تُبنى الحملات التسويقية على بيانات وأبحاث سوق فعلية وليس على افتراضات؟",en:"Are marketing campaigns built on actual market research and data rather than assumptions?"}},
      ]},
      { id:"sm2", title:{ar:"تخطيط الحملات والميزانية التسويقية",en:"Campaign Planning & Marketing Budget"}, items:[
        {id:"sm2.1",risk:"H",text:{ar:"هل يتم إعداد خطة الحملات التسويقية السنوية مسبقاً بما يكفي لضمان جاهزية المعارض والمستودعات قبل كل حملة؟",en:"Is the annual campaign plan prepared sufficiently in advance to ensure store and warehouse readiness before each campaign?"}},
        {id:"sm2.2",risk:"H",text:{ar:"هل يتم توزيع الميزانية التسويقية على القنوات والحملات وفق منهجية واضحة مبنية على العائد المتوقع (ROI)؟",en:"Is the marketing budget allocated across channels and campaigns using a clear methodology based on expected ROI?"}},
        {id:"sm2.3",risk:"H",text:{ar:"هل يتم متابعة الإنفاق التسويقي مقابل الميزانية شهرياً مع تحليل الانحرافات والتعديل الفوري؟",en:"Is marketing spend vs. budget tracked monthly with variance analysis and immediate adjustment?"}},
        {id:"sm2.4",risk:"M",text:{ar:"هل يتم قياس العائد على الإنفاق التسويقي (ROAS) لكل قناة وحملة واستخدام النتائج في تحسين تخصيص الميزانيات المستقبلية؟",en:"Is Return on Ad Spend (ROAS) measured per channel and campaign with results used to improve future budget allocation?"}},
        {id:"sm2.5",risk:"M",text:{ar:"هل يوجد تقويم تسويقي موحد مشترك بين التسويق والعمليات والمشتريات لضمان التنسيق الكامل بين الأقسام؟",en:"Is there a unified marketing calendar shared between marketing, operations, and procurement to ensure full cross-department coordination?"}},
      ]},
      { id:"sm3", title:{ar:"المرشنديزينج الاستراتيجي وتجربة المتجر",en:"Strategic Merchandising & Store Experience"}, items:[
        {id:"sm3.1",risk:"H",text:{ar:"هل يتم إعداد مخططات البلانوجرام مركزياً من قسم المرشنديزينج وتوزيعها على المعارض مع تعليمات تنفيذ واضحة؟",en:"Are planograms centrally prepared by the merchandising team and distributed to stores with clear execution instructions?"}},
        {id:"sm3.2",risk:"H",text:{ar:"هل يتم التحقق الميداني من تطبيق البلانوجرام في المعارض بشكل دوري وتوثيق الانحرافات وتصحيحها فورًا؟",en:"Is planogram compliance in stores verified through field checks periodically, with deviations documented and corrected immediately?"}},
        {id:"sm3.3",risk:"H",text:{ar:"هل قرارات تخصيص المساحات داخل المعرض (Space Allocation) مبنية على بيانات مبيعات وهامش الربح لكل فئة منتجات؟",en:"Are in-store space allocation decisions based on sales data and profit margin per product category?"}},
        {id:"sm3.4",risk:"M",text:{ar:"هل يتم تحليل أداء المنتجات بالموقع داخل المعرض (Location Performance) لتحسين أماكن العرض وزيادة المبيعات؟",en:"Is product performance by in-store location analyzed to optimize display positions and increase sales?"}},
        {id:"sm3.5",risk:"M",text:{ar:"هل يتم تصميم تجربة المتجر (Store Experience) بشكل متكامل يشمل المسار البصري للعميل من الدخول حتى نقطة البيع؟",en:"Is the Store Experience designed holistically including the customer's visual journey from entry to point of sale?"}},
        {id:"sm3.6",risk:"L",text:{ar:"هل يتم تحديث عناصر الديكور والعرض الموسمية بالتنسيق مع قسم التسويق وفق تقويم سنوي معتمد؟",en:"Are seasonal decor and display elements updated in coordination with marketing per an approved annual calendar?"}},
      ]},
      { id:"sm4", title:{ar:"التسويق الرقمي وإدارة البيانات",en:"Digital Marketing & Data Management"}, items:[
        {id:"sm4.1",risk:"H",text:{ar:"هل يوجد استراتيجية تسويق رقمي واضحة تحدد القنوات المستهدفة ونبرة التواصل والمحتوى لكل منصة؟",en:"Is there a clear digital marketing strategy defining target channels, communication tone, and content for each platform?"}},
        {id:"sm4.2",risk:"H",text:{ar:"هل يتم بناء قاعدة بيانات عملاء (CRM) وتحديثها بشكل منتظم واستخدامها في حملات التسويق المخصص (Personalization)؟",en:"Is a customer database (CRM) built and regularly updated, used for personalized marketing campaigns?"}},
        {id:"sm4.3",risk:"H",text:{ar:"هل يتم قياس مؤشرات التسويق الرقمي الرئيسية (CTR، CPL، CAC، LTV) وتحليلها شهرياً لاتخاذ قرارات مبنية على البيانات؟",en:"Are key digital marketing KPIs (CTR, CPL, CAC, LTV) measured and analyzed monthly for data-driven decision making?"}},
        {id:"sm4.4",risk:"M",text:{ar:"هل يتم إجراء اختبارات A/B للحملات الرقمية لتحسين الرسائل الإعلانية والصفحات المقصودة وزيادة معدلات التحويل؟",en:"Are A/B tests conducted for digital campaigns to optimize ad messages and landing pages for higher conversion rates?"}},
        {id:"sm4.5",risk:"M",text:{ar:"هل يتم الامتثال لمتطلبات هيئة الاتصالات وحماية البيانات الشخصية في جميع أنشطة التسويق الرقمي؟",en:"Is compliance maintained with telecommunications authority and personal data protection requirements across all digital marketing activities?"}},
      ]},
      { id:"sm5", title:{ar:"برامج الولاء وإدارة علاقات العملاء",en:"Loyalty Programs & CRM"}, items:[
        {id:"sm5.1",risk:"H",text:{ar:"هل برنامج الولاء يحقق معدل اشتراك ونشاط مرتفع وهل يتم قياس أثره على زيادة تكرار الشراء ومتوسط الفاتورة؟",en:"Does the loyalty program achieve high enrollment and activity rates, and is its impact on purchase frequency and ATV measured?"}},
        {id:"sm5.2",risk:"H",text:{ar:"هل يتم تحليل سلوك العملاء في برنامج الولاء لتحديد شرائح العملاء (Segmentation) وتقديم عروض مخصصة لكل شريحة؟",en:"Is loyalty program customer behavior analyzed for segmentation, enabling tailored offers for each customer segment?"}},
        {id:"sm5.3",risk:"M",text:{ar:"هل يتم قياس معدل استبقاء العملاء (Customer Retention Rate) وتحليل أسباب توقف العملاء عن الشراء (Churn Analysis)؟",en:"Is Customer Retention Rate measured and Churn Analysis conducted to understand why customers stop purchasing?"}},
        {id:"sm5.4",risk:"M",text:{ar:"هل يتم حساب قيمة العميل مدى الحياة (Customer Lifetime Value) واستخدامها في قرارات الاستثمار في اكتساب العملاء والاحتفاظ بهم؟",en:"Is Customer Lifetime Value (LTV) calculated and used in decisions about customer acquisition and retention investment?"}},
        {id:"sm5.5",risk:"M",text:{ar:"هل يتم مراجعة برنامج الولاء سنوياً لتقييم جاذبيته التنافسية وتطويره وفق توقعات العملاء ومعايير السوق؟",en:"Is the loyalty program reviewed annually to assess its competitive attractiveness and developed per customer expectations and market standards?"}},
      ]},
    ],
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const allItems=(dept)=>dept.sections.flatMap(s=>s.items);
const deptTotal=(dept,scores)=>allItems(dept).reduce((a,it)=>a+(scores[it.id]??0),0);
const deptMax=(dept)=>allItems(dept).length*10;
const deptPct=(dept,scores)=>deptMax(dept)>0?(deptTotal(dept,scores)/deptMax(dept))*100:0;
const secPct=(sec,scores)=>{const mx=sec.items.length*10;return mx>0?(sec.items.reduce((a,it)=>a+(scores[it.id]??0),0)/mx)*100:0;};
const pctColor=(p)=>p>=85?"#10b981":p>=65?"#f59e0b":"#ef4444";
const pctLabel=(p,t)=>p>=85?t.excellent:p>=70?t.vgood:p>=60?t.good:p>=40?t.acceptable2:t.weak;

function Ring({pct,size=80,stroke=9,color}){
  const r=(size-stroke)/2,circ=2*Math.PI*r,c=color||pctColor(pct);
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
      strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round" style={{transition:"stroke-dasharray .5s ease"}}/>
  </svg>);
}

function DeptCard({dept,scores,active,onClick,lang}){
  const pct=deptPct(dept,scores),answered=allItems(dept).filter(it=>it.id in scores).length,total=allItems(dept).length;
  return(<button onClick={onClick} className={`flex flex-col items-center gap-1.5 rounded-2xl px-4 py-3 border-2 transition-all duration-200 min-w-[130px] cursor-pointer
    ${active?`${dept.color.bg} text-white border-transparent shadow-lg scale-105`:`bg-white ${dept.color.border} ${dept.color.text} hover:shadow-md`}`}>
    <span className="text-2xl">{dept.icon}</span>
    <span className="text-xs font-bold text-center leading-tight">{dept.label[lang]}</span>
    <div className="relative"><Ring pct={pct} size={52} stroke={6} color={active?"#fff":pctColor(pct)}/>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-black" style={{color:active?"#fff":pctColor(pct)}}>{Math.round(pct)}%</span>
      </div>
    </div>
    <span className={`text-[10px] ${active?"text-white/70":"text-slate-400"}`}>{answered}/{total}</span>
  </button>);
}

function ItemRow({item,score,note,onScore,onNote,lang,t,editMode,onEdit,onDelete}){
  const RC={H:{label:{ar:"عالي",en:"High"},bg:"bg-red-100",text:"text-red-700",dot:"bg-red-500",border:"border-red-200"},M:{label:{ar:"متوسط",en:"Medium"},bg:"bg-amber-100",text:"text-amber-700",dot:"bg-amber-500",border:"border-amber-200"},L:{label:{ar:"منخفض",en:"Low"},bg:"bg-emerald-100",text:"text-emerald-700",dot:"bg-emerald-500",border:"border-emerald-200"}};
  const r=RC[item.risk],hasScore=score!==undefined;
  const rowBg=!hasScore?"":score===0?"bg-red-50/60":score===5?"bg-amber-50/60":"bg-emerald-50/60";
  const SC={0:{sel:"bg-red-600 text-white border-red-600 shadow-sm",unsel:"bg-white text-red-500 border-red-200 hover:bg-red-50"},5:{sel:"bg-amber-500 text-white border-amber-500 shadow-sm",unsel:"bg-white text-amber-600 border-amber-200 hover:bg-amber-50"},10:{sel:"bg-emerald-600 text-white border-emerald-600 shadow-sm",unsel:"bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50"}};
  return(
    <div className={`px-4 py-3.5 transition-colors ${rowBg} ${editMode?"border-l-4 border-amber-300":""}`}>
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-mono text-slate-400 mt-0.5 shrink-0 w-10">{item.id}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-700 leading-relaxed mb-2">{item.text[lang]}</p>
          {!editMode&&(
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.bg} ${r.text} ${r.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>{r.label[lang]} {t.risk}
              </span>
              <div className="flex gap-1.5">
                {[[0,t.notSat],[5,t.acceptable],[10,t.satisfied]].map(([v,lbl])=>(
                  <button key={v} onClick={()=>onScore(v)} className={`px-2.5 py-1 rounded-lg border-2 text-[11px] font-bold transition-all cursor-pointer ${score===v?SC[v].sel:SC[v].unsel}`}>
                    {lbl} ({v})
                  </button>
                ))}
              </div>
            </div>
          )}
          {!editMode&&(hasScore||note)&&<input type="text" value={note||""} onChange={e=>onNote(e.target.value)} placeholder={t.notePlaceholder}
            className="mt-2 w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-300 bg-white/70"/>}
          {editMode&&(
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${r.bg} ${r.text} ${r.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`}></span>{r.label[lang]} {t.risk}
            </span>
          )}
        </div>
        {!editMode&&(
          <div className="shrink-0 w-9 text-center">
            <span className={`text-base font-black ${!hasScore?"text-slate-200":score===0?"text-red-500":score===5?"text-amber-500":"text-emerald-500"}`}>{hasScore?score:"–"}</span>
          </div>
        )}
        {editMode&&(
          <div className="shrink-0 flex flex-col gap-1.5">
            <button onClick={onEdit} title={lang==="ar"?"تعديل":"Edit"}
              className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-sm cursor-pointer transition-colors">✏️</button>
            <button onClick={onDelete} title={lang==="ar"?"حذف":"Delete"}
              className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-sm cursor-pointer transition-colors">🗑️</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EDIT ITEM MODAL ──────────────────────────────────────────────────────────
function EditItemModal({item,lang,onSave,onClose,isNew,secTitle}){
  const [textAr,setTextAr]=useState(item?.text?.ar||"");
  const [textEn,setTextEn]=useState(item?.text?.en||"");
  const [risk,setRisk]=useState(item?.risk||"M");
  const RISKS=[{v:"H",ar:"عالي الخطورة 🔴",en:"High Risk 🔴"},{v:"M",ar:"متوسط الخطورة 🟡",en:"Medium Risk 🟡"},{v:"L",ar:"منخفض الخطورة 🟢",en:"Low Risk 🟢"}];
  return(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-slate-800 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-black text-sm">{isNew?(lang==="ar"?"➕ إضافة بند جديد":"➕ Add New Item"):(lang==="ar"?"✏️ تعديل البند":"✏️ Edit Item")}</div>
            {secTitle&&<div className="text-xs text-slate-400 mt-0.5">{secTitle}</div>}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-sm">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">📝 النص بالعربي</label>
            <textarea value={textAr} onChange={e=>setTextAr(e.target.value)} rows={3}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="اكتب نص البند بالعربي..."/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">📝 English Text</label>
            <textarea value={textEn} onChange={e=>setTextEn(e.target.value)} rows={3} dir="ltr"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Write item text in English..."/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">⚠️ {lang==="ar"?"مستوى الخطورة":"Risk Level"}</label>
            <div className="flex gap-2">
              {RISKS.map(r=>(
                <button key={r.v} onClick={()=>setRisk(r.v)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all
                    ${risk===r.v
                      ?r.v==="H"?"bg-red-600 text-white border-red-600":r.v==="M"?"bg-amber-500 text-white border-amber-500":"bg-emerald-600 text-white border-emerald-600"
                      :"bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                  {lang==="ar"?r.ar:r.en}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 cursor-pointer">
            {lang==="ar"?"إلغاء":"Cancel"}
          </button>
          <button onClick={()=>{if(!textAr.trim()&&!textEn.trim())return;onSave({text:{ar:textAr.trim()||textEn.trim(),en:textEn.trim()||textAr.trim()},risk});}}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold cursor-pointer">
            {isNew?(lang==="ar"?"➕ إضافة":"➕ Add"):(lang==="ar"?"💾 حفظ":"💾 Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── EDIT SECTION MODAL ───────────────────────────────────────────────────────
function EditSectionModal({section,lang,onSave,onClose,isNew}){
  const [titleAr,setTitleAr]=useState(section?.title?.ar||"");
  const [titleEn,setTitleEn]=useState(section?.title?.en||"");
  return(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="font-black text-sm">{isNew?(lang==="ar"?"➕ إضافة قسم فرعي جديد":"➕ Add New Section"):(lang==="ar"?"✏️ تعديل القسم الفرعي":"✏️ Edit Section")}</div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-sm">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">📂 اسم القسم بالعربي</label>
            <input value={titleAr} onChange={e=>setTitleAr(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="اسم القسم الفرعي..."/>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1.5">📂 Section Name in English</label>
            <input value={titleEn} onChange={e=>setTitleEn(e.target.value)} dir="ltr"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Section name in English..."/>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 cursor-pointer">{lang==="ar"?"إلغاء":"Cancel"}</button>
          <button onClick={()=>{if(!titleAr.trim()&&!titleEn.trim())return;onSave({ar:titleAr.trim()||titleEn.trim(),en:titleEn.trim()||titleAr.trim()});}}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold cursor-pointer">
            {isNew?(lang==="ar"?"➕ إضافة":"➕ Add"):(lang==="ar"?"💾 حفظ":"💾 Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRM DELETE MODAL ─────────────────────────────────────────────────────
function ConfirmModal({lang,message,onConfirm,onClose}){
  return(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div dir="rtl" className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <p className="text-slate-700 text-sm font-medium mb-5">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 cursor-pointer">{lang==="ar"?"إلغاء":"Cancel"}</button>
          <button onClick={onConfirm} className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold cursor-pointer">{lang==="ar"?"✓ حذف":"✓ Delete"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── SUMMARY ──────────────────────────────────────────────────────────────────
function SummaryPage({mode,scores,notes,storeInfo,recommendations,setRecommendations,grandTotal,grandMax,grandPct,criticalFails,answeredAll,totalItems,onBack,lang,t,singleDept}){
  const DEPTS=mode==="store"?STORE_DEPTS:(singleDept?[singleDept]:HQ_DEPTS);
  const sigs=mode==="store"?[t.sigStore,t.sigAuditor,t.sigArea]:[t.sigHQ1,t.sigHQ2,t.sigHQ3];
  const headerLabel=singleDept?`${singleDept.icon} ${singleDept.label[lang]}`:mode==="store"?t.storeAuditLabel:t.hqAuditLabel;
  return(<div dir={t.dir} className="min-h-screen bg-slate-100 print:bg-white">
    <div className="bg-slate-900 text-white py-4 px-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-black">📊 {t.reportTitle}</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {headerLabel} |{" "}
            {storeInfo.name&&<span>{storeInfo.name} | </span>}
            {storeInfo.auditor&&<span>{t.auditor}: {storeInfo.auditor} | </span>}
            {storeInfo.date&&<span>{storeInfo.date}</span>}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button onClick={onBack} className="bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer">{t.back}</button>
          <button onClick={()=>window.print()} className="bg-amber-500 hover:bg-amber-400 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer">{t.print}</button>
        </div>
      </div>
    </div>
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-4xl font-black" style={{color:pctColor(grandPct)}}>{Math.round(grandPct)}%</div>
            <div className="text-xl font-bold text-slate-700">{pctLabel(grandPct,t)}</div>
            <div className="text-slate-400 text-sm mt-1">{grandTotal} {t.deptOf} {grandMax} {t.scoreOf} | {answeredAll}/{totalItems} {t.answered}</div>
          </div>
          <div className="relative"><Ring pct={grandPct} size={120} stroke={12}/>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black" style={{color:pctColor(grandPct)}}>{Math.round(grandPct)}%</span>
              <span className="text-xs text-slate-400">{pctLabel(grandPct,t)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEPTS.map(d=>{const p=deptPct(d,scores);return(
          <div key={d.id} className={`bg-white rounded-2xl border ${d.color.border} p-4 shadow-sm text-center`}>
            <div className="text-2xl mb-1">{d.icon}</div>
            <div className={`text-xs font-bold ${d.color.text} mb-2`}>{d.label[lang]}</div>
            <div className="relative mx-auto w-fit"><Ring pct={p} size={64} stroke={7} color={pctColor(p)}/>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black" style={{color:pctColor(p)}}>{Math.round(p)}%</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-1">{deptTotal(d,scores)}/{deptMax(d)}</div>
          </div>
        );})}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-bold text-slate-700 mb-4 text-sm">{t.deptBreakdown}</h2>
        <div className="space-y-3">
          {DEPTS.map(d=>d.sections.map(s=>{const sp=secPct(s,scores),barC=sp>=80?"#10b981":sp>=50?"#f59e0b":"#ef4444";return(
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-sm">{d.icon}</span>
              <span className="text-xs text-slate-600 w-52 truncate">{s.title[lang]}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{width:`${sp}%`,backgroundColor:barC}}/>
              </div>
              <span className="text-xs font-bold w-10" style={{color:barC}}>{Math.round(sp)}%</span>
            </div>
          );}))}
        </div>
      </div>
      {criticalFails.length>0&&(
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{criticalFails.length}</span>
            {t.criticalTitle}
          </h2>
          <div className="space-y-2">{criticalFails.map(it=>(
            <div key={it.id} className="flex gap-2 bg-white border border-red-100 rounded-xl p-3">
              <span className="text-xs font-mono text-red-400 shrink-0 w-12">[{it.id}]</span>
              <div>
                <div className="text-xs text-red-600 font-semibold">{it.deptLabel} — {it.sectionTitle}</div>
                <div className="text-xs text-red-700 mt-0.5">{it.text[lang]}</div>
                {notes[it.id]&&<div className="text-xs text-slate-500 mt-1">📝 {notes[it.id]}</div>}
              </div>
            </div>
          ))}</div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-bold text-slate-700 mb-4">{t.recommendTitle}</h2>
        <div className="space-y-4">{DEPTS.map(d=>(
          <div key={d.id}>
            <label className={`text-sm font-bold ${d.color.text} flex items-center gap-1 mb-1`}>{d.icon} {d.label[lang]}</label>
            <textarea value={recommendations[d.id]||""} onChange={e=>setRecommendations(p=>({...p,[d.id]:e.target.value}))}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
              rows={2} placeholder={t.recPlaceholder(d.label[lang])}/>
          </div>
        ))}</div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-3 gap-6 text-center">
          {sigs.map(title=>(
            <div key={title}><div className="text-xs text-slate-500 mb-3">{title}</div>
              <div className="border-b-2 border-slate-300 pt-12"></div>
              <div className="text-xs text-slate-400 mt-1">{t.sigLine}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <style>{`@media print{button{display:none!important;}}`}</style>
  </div>);
}

// ─── LANG TOGGLE ─────────────────────────────────────────────────────────────
function LangToggle({lang,setLang}){
  return(
    <button onClick={()=>setLang(l=>l==="ar"?"en":"ar")}
      className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-xl font-bold cursor-pointer border border-white/20">
      <span>{lang==="ar"?"🇺🇸":"🇸🇦"}</span><span>{lang==="ar"?"EN":"عربي"}</span>
    </button>
  );
}

// ─── MODE SELECTOR ────────────────────────────────────────────────────────────
function ModeSelector({lang,setLang,t,onSelect}){
  return(
    <div dir={t.dir} className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="absolute top-4 right-4"><LangToggle lang={lang} setLang={setLang}/></div>
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏬</div>
        <h1 className="text-3xl font-black text-white">{t.appSub}</h1>
        <p className="text-slate-400 mt-2 text-sm">{t.appTitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        <button onClick={()=>onSelect("store")} className="bg-white hover:bg-sky-50 border-2 border-slate-200 hover:border-sky-400 rounded-2xl p-7 text-center cursor-pointer group shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-5xl mb-3">🏪</div>
          <div className="text-lg font-black text-slate-800 group-hover:text-sky-700">{t.modeStore}</div>
          <p className="text-slate-400 text-xs mt-2">{t.modeStoreDesc}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {STORE_DEPTS.map(d=><span key={d.id} className={`text-xs px-2 py-0.5 rounded-full ${d.color.light} ${d.color.text} border ${d.color.border}`}>{d.icon} {d.label[lang]}</span>)}
          </div>
        </button>
        <button onClick={()=>onSelect("hq")} className="bg-white hover:bg-orange-50 border-2 border-slate-200 hover:border-orange-400 rounded-2xl p-7 text-center cursor-pointer group shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          <div className="text-5xl mb-3">🏢</div>
          <div className="text-lg font-black text-slate-800 group-hover:text-orange-700">{t.modeHQ}</div>
          <p className="text-slate-400 text-xs mt-2">{t.modeHQDesc}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {HQ_DEPTS.map(d=><span key={d.id} className={`text-xs px-2 py-0.5 rounded-full ${d.color.light} ${d.color.text} border ${d.color.border}`}>{d.icon} {d.label[lang]}</span>)}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{HQ_DEPTS.length} {lang==="ar"?"أقسام مستقلة":"independent departments"}</p>
        </button>
      </div>
    </div>
  );
}

// ─── HQ DEPT PICKER ───────────────────────────────────────────────────────────
function HQDeptSelector({lang,setLang,t,hqData,hqDepts,onSelect,onBack}){
  const done=hqDepts.filter(d=>allItems(d).length>0&&allItems(d).every(it=>it.id in (hqData[d.id]?.scores||{}))).length;
  return(
    <div dir={t.dir} className="min-h-screen bg-slate-900">
      <div className="text-white py-5 px-4 shadow-xl" style={{background:"linear-gradient(to left,#0f172a,#7c2d12)"}}>
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg cursor-pointer">🏠</button>
            <div>
              <div className="text-base font-black">{t.appSub}</div>
              <div className="text-xs text-white/50">{t.hqAuditLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang}/>
            <div className="text-xs text-white/70 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              {done}/{hqDepts.length} {lang==="ar"?"مكتمل":"completed"}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-slate-400 text-sm text-center mb-6">
          {lang==="ar"?"اختر القسم — كل قسم يُقيَّم ويُطبَع بشكل مستقل تماماً":"Select a department — each one is audited and reported independently"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hqDepts.map(d=>{
            const sc=hqData[d.id]?.scores||{};
            const items=allItems(d);
            const answered=items.filter(it=>it.id in sc).length;
            const pct=deptPct(d,sc);
            const started=answered>0;
            const isDone=items.length>0&&answered===items.length;
            return(
              <button key={d.id} onClick={()=>onSelect(d.id)}
                className={`relative bg-white rounded-2xl border-2 p-5 text-center cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200
                  ${isDone?`${d.color.border} shadow-md`:"border-slate-200 hover:border-slate-300"}`}>
                {isDone&&<div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full ${d.color.bg} text-white text-xs flex items-center justify-center font-black shadow`}>✓</div>}
                <div className="text-3xl mb-2">{d.icon}</div>
                <div className={`text-xs font-bold leading-tight mb-3 ${isDone?d.color.text:"text-slate-700"}`}>{d.label[lang]}</div>
                {started?(
                  <div className="relative mx-auto w-fit">
                    <Ring pct={pct} size={56} stroke={6} color={pctColor(pct)}/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-black" style={{color:pctColor(pct)}}>{Math.round(pct)}%</span>
                    </div>
                  </div>
                ):(
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
                    <span className="text-slate-400 text-2xl">+</span>
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-2">{started?`${answered}/${items.length}`:`${items.length} ${lang==="ar"?"بند":"items"}`}</div>
                <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full
                  ${isDone?`${d.color.light} ${d.color.text}`:started?"bg-amber-50 text-amber-600":"bg-slate-100 text-slate-400"}`}>
                  {isDone?(lang==="ar"?"✓ مكتمل":"✓ Done"):started?(lang==="ar"?"جارٍ...":"In progress"):(lang==="ar"?"لم يبدأ":"Not started")}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AUDIT VIEW ───────────────────────────────────────────────────────────────
function AuditView({mode,dept,allDepts,scores,setScores,notes,setNotes,openSections,setOpenSections,storeInfo,setStoreInfo,lang,setLang,t,onBack,onReport,onEditDepts}){
  const [activeDeptId,setActiveDeptId]=useState(dept.id);
  const [editMode,setEditMode]=useState(false);
  const [modal,setModal]=useState(null);
  // modal types: {type:'editItem',item,deptId,secId} | {type:'addItem',deptId,secId,secTitle}
  //              {type:'editSec',sec,deptId} | {type:'addSec',deptId} | {type:'confirmDel',...}

  const currentDept=mode==="store"?(allDepts.find(d=>d.id===activeDeptId)||dept):dept;
  const grandTotal=mode==="store"?allDepts.reduce((a,d)=>a+deptTotal(d,scores),0):deptTotal(dept,scores);
  const grandMax=mode==="store"?allDepts.reduce((a,d)=>a+deptMax(d),0):deptMax(dept);
  const grandPct=grandMax>0?(grandTotal/grandMax)*100:0;
  const totalItems=mode==="store"?allDepts.reduce((a,d)=>a+allItems(d).length,0):allItems(dept).length;
  const answered=mode==="store"?Object.keys(scores).length:allItems(dept).filter(it=>it.id in scores).length;
  const FIELDS=mode==="store"
    ?[[t.storeName,"name"],[t.storeCode,"code"],[t.region,"region"],[t.auditor,"auditor"],[t.date,"date"]]
    :[[t.hqName,"name"],[t.hqCode,"code"],[t.hqRegion,"region"],[t.auditor,"auditor"],[t.date,"date"]];
  const toggleSec=(id)=>setOpenSections(p=>({...p,[id]:!p[id]}));

  const hqBgMap={orange:"#7c2d12",teal:"#134e4a",indigo:"#312e81",cyan:"#164e63","green-7":"#14532d","purple-7":"#581c87",pink:"#831843",yellow:"#713f12"};
  const getBg=()=>{
    if(mode==="store")return null;
    const bg=dept.color.bg;
    const key=Object.keys(hqBgMap).find(k=>bg.includes(k));
    return key?{background:`linear-gradient(to left,#0f172a,${hqBgMap[key]})`}:null;
  };
  const headerStyle=getBg()||{};
  const headerClass=mode==="store"?"bg-gradient-to-l from-sky-900 to-slate-900":"";

  // ── CRUD HELPERS ──────────────────────────────────────────────────────────
  const genId=(prefix)=>`${prefix}_${Date.now()}`;

  const saveItem=(deptId,secId,itemId,updates)=>{
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:d.sections.map(s=>s.id!==secId?s:{...s,
      items:s.items.map(it=>it.id!==itemId?it:{...it,...updates})})}));
    setModal(null);
  };
  const addItem=(deptId,secId,data)=>{
    const newItem={id:genId(secId),risk:data.risk,text:data.text};
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:d.sections.map(s=>s.id!==secId?s:{...s,items:[...s.items,newItem]})}));
    setModal(null);
  };
  const deleteItem=(deptId,secId,itemId)=>{
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:d.sections.map(s=>s.id!==secId?s:{...s,items:s.items.filter(it=>it.id!==itemId)})}));
    setScores(p=>{const n={...p};delete n[itemId];return n;});
    setModal(null);
  };
  const saveSection=(deptId,secId,title)=>{
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:d.sections.map(s=>s.id!==secId?s:{...s,title})}));
    setModal(null);
  };
  const addSection=(deptId,title)=>{
    const newSec={id:genId(deptId),title,items:[]};
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:[...d.sections,newSec]}));
    setModal(null);
  };
  const deleteSection=(deptId,secId)=>{
    onEditDepts(prev=>prev.map(d=>d.id!==deptId?d:{...d,sections:d.sections.filter(s=>s.id!==secId)}));
    setModal(null);
  };

  return(
    <div dir={t.dir} className="min-h-screen bg-slate-100">
      {/* MODALS */}
      {modal?.type==="editItem"&&<EditItemModal item={modal.item} lang={lang} isNew={false} secTitle={modal.secTitle}
        onSave={d=>saveItem(modal.deptId,modal.secId,modal.item.id,d)} onClose={()=>setModal(null)}/>}
      {modal?.type==="addItem"&&<EditItemModal item={null} lang={lang} isNew={true} secTitle={modal.secTitle}
        onSave={d=>addItem(modal.deptId,modal.secId,d)} onClose={()=>setModal(null)}/>}
      {modal?.type==="editSec"&&<EditSectionModal section={modal.sec} lang={lang} isNew={false}
        onSave={title=>saveSection(modal.deptId,modal.sec.id,title)} onClose={()=>setModal(null)}/>}
      {modal?.type==="addSec"&&<EditSectionModal section={null} lang={lang} isNew={true}
        onSave={title=>addSection(modal.deptId,title)} onClose={()=>setModal(null)}/>}
      {modal?.type==="confirmDel"&&<ConfirmModal lang={lang} message={modal.message}
        onConfirm={modal.onConfirm} onClose={()=>setModal(null)}/>}

      {/* TOP BAR */}
      <div className={`${headerClass} text-white sticky top-0 z-30 shadow-xl`} style={headerStyle}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer text-lg">
              {mode==="hq"?"◀":"🏠"}
            </button>
            <div>
              <div className="text-sm font-black">{mode==="store"?t.appSub:`${dept.icon} ${dept.label[lang]}`}</div>
              <div className="text-xs text-white/50">{mode==="store"?t.storeAuditLabel:t.hqAuditLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <LangToggle lang={lang} setLang={setLang}/>
            {/* Edit Mode Toggle */}
            <button onClick={()=>setEditMode(e=>!e)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-bold cursor-pointer border transition-all
                ${editMode?"bg-amber-500 text-white border-amber-400 shadow-md":"bg-white/10 hover:bg-white/20 text-white border-white/20"}`}>
              <span>{editMode?"🔒":"✏️"}</span>
              <span>{editMode?(lang==="ar"?"إيقاف التعديل":"Stop Editing"):(lang==="ar"?"تعديل البنود":"Edit Items")}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative"><Ring pct={grandPct} size={44} stroke={5}/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">{Math.round(grandPct)}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{grandTotal}<span className="text-white/40">/{grandMax}</span></div>
                <div className="text-[10px] text-white/50">{answered}/{totalItems}</div>
              </div>
            </div>
            <button onClick={onReport} className="bg-amber-500 hover:bg-amber-400 text-white text-xs px-3 py-2 rounded-xl font-bold cursor-pointer">
              📊 {t.finalReport}
            </button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap gap-3">
            {FIELDS.map(([label,key])=>(
              <div key={key} className="flex items-center gap-1">
                <span className="text-[10px] text-white/40">{label}:</span>
                <input type={key==="date"?"date":"text"} value={storeInfo[key]||""}
                  onChange={e=>setStoreInfo(p=>({...p,[key]:e.target.value}))}
                  className="bg-white/10 text-white text-[11px] px-2 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-white/30 w-28"
                  placeholder={label}/>
              </div>
            ))}
          </div>
        </div>
        {editMode&&(
          <div className="border-t border-amber-400/30 bg-amber-500/10">
            <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2">
              <span className="text-amber-300 text-xs">✏️</span>
              <span className="text-amber-200 text-xs font-medium">
                {lang==="ar"?"وضع التعديل مفعّل — يمكنك إضافة وتعديل وحذف البنود والأقسام":"Edit mode active — you can add, edit and delete items and sections"}
              </span>
            </div>
          </div>
        )}
      </div>

      {mode==="store"&&(
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {allDepts.map(d=><DeptCard key={d.id} dept={d} scores={scores} active={activeDeptId===d.id} onClick={()=>setActiveDeptId(d.id)} lang={lang}/>)}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 pb-10 space-y-3 pt-4">
        {currentDept.sections.map(sec=>{
          const sp=secPct(sec,scores),isOpen=!!openSections[sec.id];
          const answeredSec=sec.items.filter(it=>it.id in scores).length;
          const barC=sp>=80?"bg-emerald-500":sp>=50?"bg-amber-500":"bg-red-500";
          const secScore=sec.items.reduce((a,it)=>a+(scores[it.id]??0),0);
          return(
            <div key={sec.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${editMode?"border-amber-300":"border-slate-200"}`}>
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
                <button onClick={()=>toggleSec(sec.id)} className="flex-1 flex items-center gap-3 cursor-pointer text-right">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-slate-800">{sec.title[lang]}</span>
                      <span className="text-xs text-slate-400">({sec.items.length} {t.items})</span>
                      {answeredSec===sec.items.length&&sec.items.length>0&&<span className={`text-xs font-bold px-2 py-0.5 rounded-full ${currentDept.color.light} ${currentDept.color.text} border ${currentDept.color.border}`}>{t.completed}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barC} rounded-full transition-all duration-500`} style={{width:`${sp}%`}}/>
                      </div>
                      <span className={`text-xs font-bold ${sp>=80?"text-emerald-600":sp>=50?"text-amber-600":"text-red-500"}`}>{secScore}/{sec.items.length*10}</span>
                    </div>
                  </div>
                  <span className={`text-slate-400 text-sm transition-transform duration-200 ${isOpen?(lang==="ar"?"rotate-90":"-rotate-90"):""}`}>{lang==="ar"?"◀":"▶"}</span>
                </button>
                {editMode&&(
                  <div className="flex gap-1 shrink-0">
                    <button onClick={()=>setModal({type:"editSec",sec,deptId:currentDept.id})}
                      className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-sm cursor-pointer" title={lang==="ar"?"تعديل اسم القسم":"Edit section name"}>✏️</button>
                    <button onClick={()=>setModal({type:"confirmDel",message:lang==="ar"?`هل تريد حذف القسم الفرعي "${sec.title.ar}" وجميع بنوده؟`:`Delete section "${sec.title.en}" and all its items?`,onConfirm:()=>deleteSection(currentDept.id,sec.id)})}
                      className="w-8 h-8 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-sm cursor-pointer" title={lang==="ar"?"حذف القسم":"Delete section"}>🗑️</button>
                  </div>
                )}
              </div>
              {isOpen&&(
                <div className="border-t border-slate-100">
                  <div className="divide-y divide-slate-50">
                    {sec.items.map(item=>(
                      <ItemRow key={item.id} item={item} score={scores[item.id]} note={notes[item.id]}
                        onScore={v=>setScores(p=>({...p,[item.id]:v}))}
                        onNote={v=>setNotes(p=>({...p,[item.id]:v}))}
                        lang={lang} t={t} editMode={editMode}
                        onEdit={()=>setModal({type:"editItem",item,deptId:currentDept.id,secId:sec.id,secTitle:sec.title[lang]})}
                        onDelete={()=>setModal({type:"confirmDel",message:lang==="ar"?`هل تريد حذف هذا البند؟`:"Delete this item?",onConfirm:()=>deleteItem(currentDept.id,sec.id,item.id)})}/>
                    ))}
                  </div>
                  {editMode&&(
                    <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                      <button onClick={()=>setModal({type:"addItem",deptId:currentDept.id,secId:sec.id,secTitle:sec.title[lang]})}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border-2 border-dashed border-amber-300 text-amber-600 hover:bg-amber-100 text-xs font-bold cursor-pointer transition-colors">
                        <span>➕</span><span>{lang==="ar"?"إضافة بند جديد لهذا القسم":"Add new item to this section"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {editMode&&(
          <button onClick={()=>setModal({type:"addSec",deptId:currentDept.id})}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 hover:bg-white hover:border-slate-400 text-sm font-bold cursor-pointer transition-all">
            <span className="text-xl">📂</span>
            <span>{lang==="ar"?"إضافة قسم فرعي جديد":"Add new sub-section"}</span>
          </button>
        )}
      </div>
      <style>{`@media print{button{display:none!important;}}`}</style>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function RetailAuditProV2(){
  const [lang,setLang]=useState("ar");
  const [mode,setMode]=useState(null);
  const [hqDeptId,setHqDeptId]=useState(null);
  const [showSummary,setShowSummary]=useState(false);

  // Mutable dept data (supports CRUD)
  const deepClone=(o)=>JSON.parse(JSON.stringify(o));
  const [storeDepts,setStoreDepts]=useState(()=>deepClone(STORE_DEPTS));
  const [hqDepts,setHqDepts]=useState(()=>deepClone(HQ_DEPTS));

  // Store scores/notes
  const [storeScores,setStoreScores]=useState({});
  const [storeNotes,setStoreNotes]=useState({});
  const [storeInfo,setStoreInfo]=useState({name:"",code:"",region:"",auditor:"",date:new Date().toISOString().split("T")[0]});
  const [storeOpenSec,setStoreOpenSec]=useState({ops1:true});
  const [storeRec,setStoreRec]=useState({});

  // HQ: each dept isolated
  const [hqData,setHqData]=useState(()=>
    Object.fromEntries(HQ_DEPTS.map(d=>[d.id,{
      scores:{},notes:{},
      info:{name:"",code:"",region:"",auditor:"",date:new Date().toISOString().split("T")[0]},
      openSec:{[d.sections[0].id]:true},rec:{}
    }]))
  );

  const t=T[lang];
  const hqDept=hqDepts.find(d=>d.id===hqDeptId);
  const hqD=hqDeptId?hqData[hqDeptId]:{};
  const setHqF=(field,val)=>setHqData(p=>({...p,[hqDeptId]:{...p[hqDeptId],[field]:typeof val==="function"?val(p[hqDeptId][field]):val}}));

  // When a new HQ dept is added via CRUD, init its hqData slot
  const handleHqDeptsEdit=(updater)=>{
    setHqDepts(prev=>{
      const next=typeof updater==="function"?updater(prev):updater;
      // init data for any new dept id
      const newIds=next.map(d=>d.id).filter(id=>!prev.find(d=>d.id===id));
      if(newIds.length>0){
        setHqData(p=>({...p,...Object.fromEntries(newIds.map(id=>[id,{scores:{},notes:{},info:{name:"",code:"",region:"",auditor:"",date:new Date().toISOString().split("T")[0]},openSec:{},rec:{}}]))}));
      }
      return next;
    });
  };

  const storeCritical=useMemo(()=>{const out=[];storeDepts.forEach(d=>d.sections.forEach(s=>s.items.forEach(it=>{if(it.risk==="H"&&storeScores[it.id]===0)out.push({...it,deptLabel:d.label[lang],sectionTitle:s.title[lang]});})));return out;},[storeScores,storeDepts,lang]);
  const hqCritical=useMemo(()=>{if(!hqDept)return[];const sc=hqD.scores||{};const out=[];hqDept.sections.forEach(s=>s.items.forEach(it=>{if(it.risk==="H"&&sc[it.id]===0)out.push({...it,deptLabel:hqDept.label[lang],sectionTitle:s.title[lang]});}));return out;},[hqData,hqDeptId,hqDepts,lang]);

  if(!mode) return <ModeSelector lang={lang} setLang={setLang} t={t} onSelect={m=>{setMode(m);setShowSummary(false);}}/>;
  if(mode==="hq"&&!hqDeptId) return <HQDeptSelector lang={lang} setLang={setLang} t={t} hqData={hqData} hqDepts={hqDepts} onSelect={id=>{setHqDeptId(id);setShowSummary(false);}} onBack={()=>setMode(null)}/>;

  if(mode==="store"&&showSummary){
    const gt=storeDepts.reduce((a,d)=>a+deptTotal(d,storeScores),0);
    const gm=storeDepts.reduce((a,d)=>a+deptMax(d),0);
    return <SummaryPage mode="store" scores={storeScores} notes={storeNotes} storeInfo={storeInfo}
      recommendations={storeRec} setRecommendations={setStoreRec}
      grandTotal={gt} grandMax={gm} grandPct={gm>0?gt/gm*100:0}
      criticalFails={storeCritical} answeredAll={Object.keys(storeScores).length}
      totalItems={storeDepts.reduce((a,d)=>a+allItems(d).length,0)}
      onBack={()=>setShowSummary(false)} lang={lang} t={t} singleDept={null}/>;
  }
  if(mode==="hq"&&hqDeptId&&showSummary){
    const sc=hqD.scores||{};
    const gt=deptTotal(hqDept,sc),gm=deptMax(hqDept);
    return <SummaryPage mode="hq" scores={sc} notes={hqD.notes||{}} storeInfo={hqD.info||{}}
      recommendations={hqD.rec||{}} setRecommendations={v=>setHqF("rec",v)}
      grandTotal={gt} grandMax={gm} grandPct={gm>0?gt/gm*100:0}
      criticalFails={hqCritical} answeredAll={allItems(hqDept).filter(it=>it.id in sc).length}
      totalItems={allItems(hqDept).length}
      onBack={()=>setShowSummary(false)} lang={lang} t={t} singleDept={hqDept}/>;
  }

  if(mode==="store") return <AuditView mode="store" dept={storeDepts[0]} allDepts={storeDepts}
    scores={storeScores} setScores={setStoreScores}
    notes={storeNotes} setNotes={setStoreNotes}
    openSections={storeOpenSec} setOpenSections={setStoreOpenSec}
    storeInfo={storeInfo} setStoreInfo={setStoreInfo}
    lang={lang} setLang={setLang} t={t}
    onBack={()=>setMode(null)} onReport={()=>setShowSummary(true)}
    onEditDepts={setStoreDepts}/>;

  return <AuditView mode="hq" dept={hqDept} allDepts={[hqDept]}
    scores={hqD.scores||{}} setScores={v=>setHqF("scores",v)}
    notes={hqD.notes||{}} setNotes={v=>setHqF("notes",v)}
    openSections={hqD.openSec||{[hqDept.sections[0].id]:true}} setOpenSections={v=>setHqF("openSec",v)}
    storeInfo={hqD.info||{}} setStoreInfo={v=>setHqF("info",v)}
    lang={lang} setLang={setLang} t={t}
    onBack={()=>{setHqDeptId(null);setShowSummary(false);}}
    onReport={()=>setShowSummary(true)}
    onEditDepts={handleHqDeptsEdit}/>;
}
