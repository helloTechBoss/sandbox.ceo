import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // ── TEAM MEMBERS ──────────────────────────────────────────────
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: { tc: '合規顧問團隊', en: 'Compliance Advisory Team', sc: '合规顾问团队' },
          title: { tc: '資深合規顧問', en: 'Senior Compliance Advisors', sc: '资深合规顾问' },
          bio: { tc: '由資深合規顧問及法律專業人士組成，具備銀行、證券、保險及虛擬資產等多個監管領域的實戰經驗，為客戶提供全面的合規解決方案。', en: 'Comprising senior compliance consultants and legal professionals with hands-on experience across banking, securities, insurance and virtual asset regulatory domains.', sc: '由资深合规顾问及法律专业人士组成，具备银行、证券、保险及虚拟资产等多个监管领域的实战经验，为客户提供全面的合规解决方案。' },
          order: 1,
        },
        {
          name: { tc: '牌照申請專隊', en: 'Licensing Application Team', sc: '牌照申请专队' },
          title: { tc: '牌照申請顧問', en: 'Licensing Application Advisors', sc: '牌照申请顾问' },
          bio: { tc: '專注處理 MSO、SFC、IA 及其他香港金融監管牌照申請，熟悉各監管機構的審批流程及要求，曾協助逾百家企業成功取得牌照。', en: 'Specialising in MSO, SFC, IA and other Hong Kong financial regulatory licence applications, having assisted over 100 companies to successfully obtain licences.', sc: '专注处理 MSO、SFC、IA 及其他香港金融监管牌照申请，熟悉各监管机构的审批流程及要求，曾协助逾百家企业成功取得牌照。' },
          order: 2,
        },
        {
          name: { tc: '企業服務團隊', en: 'Corporate Services Team', sc: '企业服务团队' },
          title: { tc: 'TCSP 持牌企業服務顧問', en: 'TCSP-Licensed Corporate Service Advisors', sc: 'TCSP 持牌企业服务顾问' },
          bio: { tc: '持有 TCSP 牌照的公司秘書及企業服務專業人士，為客戶提供公司註冊、秘書、會計及人力資源一站式服務。', en: 'TCSP-licensed company secretarial and corporate services professionals providing one-stop company registration, secretarial, accounting and HR services.', sc: '持有 TCSP 牌照的公司秘书及企业服务专业人士，为客户提供公司注册、秘书、会计及人力资源一站式服务。' },
          order: 3,
        },
      ],
    });
    console.log('✓ Team members seeded');
  } else {
    console.log(`  Team members already exist (${teamCount}), skipping`);
  }

  // ── FAQS ──────────────────────────────────────────────────────
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        { pageSlug: 'mso', subTab: 'overview', order: 1,
          question: { tc: '申請 MSO 牌照需要多長時間？', en: 'How long does an MSO licence application take?', sc: '申请 MSO 牌照需要多长时间？' },
          answer: { tc: '一般由遞交至獲批約需 3–6 個月，視乎海關審查進度及申請人的配合程度。充分準備的申請可縮短審批時間。', en: 'Generally 3–6 months from submission to approval, depending on Customs review progress and applicant cooperation.', sc: '一般由递交至获批约需 3–6 个月，视乎海关审查进度及申请人的配合程度。充分准备的申请可缩短审批时间。' } },
        { pageSlug: 'mso', subTab: 'overview', order: 2,
          question: { tc: '如果之前申請被拒，可以重新申請嗎？', en: 'Can I reapply if my previous application was rejected?', sc: '如果之前申请被拒，可以重新申请吗？' },
          answer: { tc: '可以。但需先了解被拒原因，針對性改善申請材料及 AML 框架後再行遞交。我們專門協助曾被拒絕的申請人重新申請。', en: 'Yes. You need to understand the reasons for rejection first, then improve your application materials and AML framework. We specialise in helping previously rejected applicants reapply.', sc: '可以。但需先了解被拒原因，针对性改善申请材料及 AML 框架后再行递交。我们专门协助曾被拒绝的申请人重新申请。' } },
        { pageSlug: 'mso', subTab: 'overview', order: 3,
          question: { tc: '申請費用是多少？', en: 'What are the application fees?', sc: '申请费用是多少？' },
          answer: { tc: '政府申請費用為 HK$3,010（兩年期牌照）。我們的顧問服務費用視乎申請複雜程度而定，歡迎 WhatsApp 查詢報價。', en: 'The government application fee is HK$3,010 (for a 2-year licence). Our consultancy fees depend on application complexity. Please WhatsApp us for a quote.', sc: '政府申请费用为 HK$3,010（两年期牌照）。我们的顾问服务费用视乎申请复杂程度而定，欢迎 WhatsApp 查询报价。' } },
        { pageSlug: 'licensing', subTab: 'sfc', order: 1,
          question: { tc: 'SFC 牌照申請需時多久？', en: 'How long does an SFC licence application take?', sc: 'SFC 牌照申请需时多久？' },
          answer: { tc: 'SFC 牌照申請一般需要 6–12 個月，視乎牌照類別及申請複雜程度而定。備齊充分的文件及符合資格的負責人員可縮短審批時間。', en: 'SFC licence applications generally take 6–12 months depending on licence type and complexity. Complete documentation and qualified responsible officers can shorten approval time.', sc: 'SFC 牌照申请一般需要 6–12 个月，视乎牌照类别及申请复杂程度而定。备齐充分的文件及符合资格的负责人员可缩短审批时间。' } },
        { pageSlug: 'licensing', subTab: 'sfc', order: 2,
          question: { tc: '負責人員 (Responsible Officer) 的資格要求？', en: 'What are the qualifications for a Responsible Officer?', sc: '负责人员 (Responsible Officer) 的资格要求？' },
          answer: { tc: '負責人員須通過相關資格考試、具備相關工作經驗，並通過 SFC 的「適當人選」評估，包括誠信、財務穩健性等考量。', en: "Responsible officers must pass relevant qualification exams, have relevant work experience, and pass SFC's \"fit and proper\" assessment including integrity and financial soundness.", sc: '负责人员须通过相关资格考试、具备相关工作经验，并通过 SFC 的"适当人选"评估，包括诚信、财务稳健性等考量。' } },
        { pageSlug: 'licensing', subTab: 'sfc', order: 3,
          question: { tc: '申請 SFC 牌照需要多少資本？', en: 'How much capital is required for an SFC licence?', sc: '申请 SFC 牌照需要多少资本？' },
          answer: { tc: '不同牌照類別的最低流動資本要求不同，例如第一類牌照一般要求最低流動資本 HK$3,000,000。我們會在初步評估時為您提供詳細的資本要求資訊。', en: 'Minimum liquid capital requirements vary by licence type; Type 1 licences generally require HK$3,000,000. We provide detailed capital requirement information during initial assessment.', sc: '不同牌照类别的最低流动资本要求不同，例如第一类牌照一般要求最低流动资本 HK$3,000,000。我们会在初步评估时为您提供详细的资本要求资讯。' } },
        { pageSlug: 'licensing', subTab: 'hk-other', order: 1,
          question: { tc: '保險經紀牌照申請需時多久？', en: 'How long does an insurance broker licence application take?', sc: '保险经纪牌照申请需时多久？' },
          answer: { tc: 'IA 保險經紀牌照申請一般需時 3–6 個月，視乎申請人的資格及業務架構的完整程度而定。', en: "IA insurance broker licence applications generally take 3–6 months, depending on the applicant's qualifications and business structure completeness.", sc: 'IA 保险经纪牌照申请一般需时 3–6 个月，视乎申请人的资格及业务架构的完整程度而定。' } },
        { pageSlug: 'licensing', subTab: 'hk-other', order: 2,
          question: { tc: '放債人牌照需要每年續期嗎？', en: 'Does a money lender licence require annual renewal?', sc: '放债人牌照需要每年续期吗？' },
          answer: { tc: '是的，放債人牌照每年須向法院申請續期，並提交相關財務資料及合規聲明。我們提供每年續牌代辦服務。', en: 'Yes, money lender licences must be renewed annually through the court with financial information and compliance declarations. We provide annual renewal services.', sc: '是的，放债人牌照每年须向法院申请续期，并提交相关财务资料及合规声明。我们提供每年续牌代办服务。' } },
        { pageSlug: 'licensing', subTab: 'overseas', order: 1,
          question: { tc: '美國 MSB 登記和 MTL 有何分別？', en: 'What is the difference between US MSB registration and MTL?', sc: '美国 MSB 登记和 MTL 有何分别？' },
          answer: { tc: 'MSB 聯邦登記是向 FinCEN 的全國性登記，免費且相對簡單，但不授權在各州實際經營。MTL 是各州的營業牌照，是實際合法服務美國客戶的必要條件。', en: 'MSB federal registration is a national registration with FinCEN, free and simple, but does not authorise actual business in each state. MTL is a state-level operating licence required to legally serve US clients.', sc: 'MSB 联邦登记是向 FinCEN 的全国性登记，免费且相对简单，但不授权在各州实际经营。MTL 是各州的营业牌照，是实际合法服务美国客户的必要条件。' } },
        { pageSlug: 'licensing', subTab: 'overseas', order: 2,
          question: { tc: '加拿大 MSB 申請需時多久？', en: 'How long does a Canadian MSB application take?', sc: '加拿大 MSB 申请需时多久？' },
          answer: { tc: '加拿大 FINTRAC MSB 登記一般需時 4–8 週，費用低且流程相對簡便，是進入加拿大市場的首選途徑。', en: 'Canadian FINTRAC MSB registration generally takes 4–8 weeks, with low fees and a straightforward process, making it the preferred route for entering the Canadian market.', sc: '加拿大 FINTRAC MSB 登记一般需时 4–8 周，费用低且流程相对简便，是进入加拿大市场的首选途径。' } },
        { pageSlug: 'compliance', subTab: 'ongoing', order: 1,
          question: { tc: '外聘合規主任服務有何優勢？', en: 'What are the advantages of outsourced compliance officer services?', sc: '外聘合规主任服务有何优势？' },
          answer: { tc: '相比全職聘用合規主任，外聘服務可節省 60–80% 成本，同時獲得由多名資深合規顧問支援的機構級服務。尤其適合中小型持牌機構。', en: 'Outsourced compliance services can save 60–80% compared to a full-time hire, while providing institutional-grade service backed by multiple senior consultants. Especially suitable for small and medium-sized licensed institutions.', sc: '相比全职聘用合规主任，外聘服务可节省 60–80% 成本，同时获得由多名资深合规顾问支援的机构级服务。尤其适合中小型持牌机构。' } },
        { pageSlug: 'compliance', subTab: 'ongoing', order: 2,
          question: { tc: '外聘合規主任是否獲 SFC 認可？', en: 'Are outsourced compliance officers recognised by the SFC?', sc: '外聘合规主任是否获 SFC 认可？' },
          answer: { tc: '是的。SFC 允許持牌法團委任外聘合規主任，惟外聘人員須符合 SFC 對負責人員資格的要求，並須向 SFC 申報。我們的合規主任均具備相關資格及經驗。', en: "Yes. The SFC allows licensed corporations to appoint outsourced compliance officers, provided they meet SFC's qualification requirements and are reported to the SFC. Our compliance officers have the relevant qualifications.", sc: '是的。SFC 允许持牌法团委任外聘合规主任，惟外聘人员须符合 SFC 对负责人员资格的要求，并须向 SFC 申报。我们的合规主任均具备相关资格及经验。' } },
        { pageSlug: 'compliance', subTab: 'audit', order: 1,
          question: { tc: '多久需要進行一次 AML 審計？', en: 'How often should an AML audit be conducted?', sc: '多久需要进行一次 AML 审计？' },
          answer: { tc: '建議每年至少進行一次 AML 獨立審計。如業務規模較大或監管風險較高，每半年進行一次更為理想。定期審計能在監管機構現場審查前識別並修補合規缺失。', en: 'At least one independent AML audit per year is recommended. For larger businesses or higher regulatory risks, semi-annual audits are ideal. Regular audits identify and remediate gaps before regulatory inspections.', sc: '建议每年至少进行一次 AML 独立审计。如业务规模较大或监管风险较高，每半年进行一次更为理想。定期审计能在监管机构现场审查前识别并修补合规缺失。' } },
        { pageSlug: 'compliance', subTab: 'audit', order: 2,
          question: { tc: '審計報告有何用途？', en: 'What are audit reports used for?', sc: '审计报告有何用途？' },
          answer: { tc: '審計報告記錄現行合規狀況及改善建議，可作為監管機構現場審查的準備文件，亦可用於管理層匯報及董事會呈閱，證明機構對合規的承擔。', en: 'Audit reports document current compliance status and recommendations, serving as preparation for regulatory inspections, management reporting, and board presentations to demonstrate institutional commitment to compliance.', sc: '审计报告记录现行合规状况及改善建议，可作为监管机构现场审查的准备文件，亦可用于管理层汇报及董事会呈阅，证明机构对合规的承担。' } },
        { pageSlug: 'compliance', subTab: 'training', order: 1,
          question: { tc: 'SFC CPT 要求是什麼？', en: 'What are the SFC CPT requirements?', sc: 'SFC CPT 要求是什么？' },
          answer: { tc: 'SFC 要求持牌代表每年完成最少 5 小時的合資格 CPT 培訓，其中至少 2 小時須為監管合規相關課程。未能符合 CPT 要求可能影響牌照的持續資格。', en: 'The SFC requires licensed representatives to complete at least 5 hours of qualifying CPT training per year, with at least 2 hours on regulatory compliance. Failure to meet CPT requirements may affect licence renewal eligibility.', sc: 'SFC 要求持牌代表每年完成最少 5 小时的合资格 CPT 培训，其中至少 2 小时须为监管合规相关课程。未能符合 CPT 要求可能影响牌照的持续资格。' } },
        { pageSlug: 'compliance', subTab: 'training', order: 2,
          question: { tc: '員工 AML 培訓有何具體要求？', en: 'What are the specific requirements for staff AML training?', sc: '员工 AML 培训有何具体要求？' },
          answer: { tc: '各監管機構對 AML 培訓的具體要求有所不同，但一般要求包括：新入職員工入職培訓、所有相關員工每年至少一次 AML 複習培訓，以及針對高風險職位的加強培訓。培訓紀錄須妥善保存。', en: 'AML training requirements vary by regulator, but generally include: induction training for new staff, at least annual AML refresher training for all relevant staff, and enhanced training for high-risk roles. Records must be properly maintained.', sc: '各监管机构对 AML 培训的具体要求有所不同，但一般要求包括：新入职员工入职培训、所有相关员工每年至少一次 AML 复习培训，以及针对高风险职位的加强培训。培训记录须妥善保存。' } },
        { pageSlug: 'corporate', subTab: 'incorporation', order: 1,
          question: { tc: '成立香港有限公司需要多長時間？', en: 'How long does it take to incorporate a Hong Kong limited company?', sc: '成立香港有限公司需要多长时间？' },
          answer: { tc: '一般申請於遞交全套資料後 5–7 個工作天內完成，即可取得公司註冊證書及商業登記證書。我們亦提供特快即日成立服務。', en: 'Standard applications are generally completed within 5–7 working days after submitting complete documentation. We also offer express same-day incorporation services.', sc: '一般申请于递交全套资料后 5–7 个工作天内完成，即可取得公司注册证书及商业登记证书。我们亦提供特快即日成立服务。' } },
        { pageSlug: 'corporate', subTab: 'incorporation', order: 2,
          question: { tc: '中國大陸居民可以成立香港有限公司嗎？', en: 'Can mainland China residents incorporate a Hong Kong company?', sc: '中国大陆居民可以成立香港有限公司吗？' },
          answer: { tc: '可以。中國大陸居民憑有效身份證明文件及住址證明，即可在香港成立有限公司，無需香港居留身份。', en: 'Yes. Mainland China residents can incorporate a Hong Kong limited company with valid identity documents and proof of address, without needing Hong Kong residency.', sc: '可以。中国大陆居民凭有效身份证明文件及住址证明，即可在香港成立有限公司，无需香港居留身份。' } },
        { pageSlug: 'corporate', subTab: 'incorporation', order: 3,
          question: { tc: '成立公司需要什麼文件？', en: 'What documents are needed to incorporate a company?', sc: '成立公司需要什么文件？' },
          answer: { tc: '所需文件包括：所有股東及董事的身份證明文件副本、住址證明（3 個月內）、公司名稱（中英文）、股份結構及公司章程細則。我們提供完整的文件準備清單。', en: 'Required documents include: identity documents for all shareholders and directors, proof of address (within 3 months), company name (Chinese and English), share structure and articles of association. We provide a complete checklist.', sc: '所需文件包括：所有股东及董事的身份证明文件副本、住址证明（3 个月内）、公司名称（中英文）、股份结构及公司章程细则。我们提供完整的文件准备清单。' } },
        { pageSlug: 'corporate', subTab: 'incorporation', order: 4,
          question: { tc: '成立公司後需要辦理什麼？', en: 'What needs to be done after incorporation?', sc: '成立公司后需要办理什么？' },
          answer: { tc: '成立後通常需要辦理：開設銀行帳戶、委任公司秘書、視乎業務性質申請相關牌照或許可證，以及設立會計及薪資紀錄系統。我們可為您提供一站式的後續安排服務。', en: 'After incorporation you typically need to: open a bank account, appoint a company secretary, apply for relevant licences based on business type, and set up accounting and payroll systems. We provide one-stop post-incorporation services.', sc: '成立后通常需要办理：开设银行账户、委任公司秘书、视乎业务性质申请相关牌照或许可证，以及设立会计及薪资记录系统。我们可为您提供一站式的后续安排服务。' } },
        { pageSlug: 'corporate', subTab: 'comsec', order: 1,
          question: { tc: '董事可否兼任公司秘書？', en: 'Can a director also act as company secretary?', sc: '董事可否兼任公司秘书？' },
          answer: { tc: '如公司只有一名董事，根據《公司條例》第 475(2) 條，該名董事不可兼任公司秘書。如公司有多於一名董事，則董事可以兼任公司秘書。', en: 'If a company has only one director, that director cannot also act as company secretary under section 475(2) of the Companies Ordinance. With more than one director, a director may also serve as company secretary.', sc: '如公司只有一名董事，根据《公司条例》第 475(2) 条，该名董事不可兼任公司秘书。如公司有多于一名董事，则董事可以兼任公司秘书。' } },
        { pageSlug: 'corporate', subTab: 'comsec', order: 2,
          question: { tc: '公司秘書須具備什麼資格？', en: 'What qualifications must a company secretary have?', sc: '公司秘书须具备什么资格？' },
          answer: { tc: '香港法例沒有規定公司秘書須持有特定專業資格，但公司秘書須為香港居民或在香港有業務地點的法人。實務上建議委任具備相關經驗的專業人士擔任。', en: 'Hong Kong law does not require a company secretary to hold specific professional qualifications, but the company secretary must be a Hong Kong resident or a legal entity with a place of business in Hong Kong.', sc: '香港法例没有规定公司秘书须持有特定专业资格，但公司秘书须为香港居民或在香港有业务地点的法人。实务上建议委任具备相关经验的专业人士担任。' } },
        { pageSlug: 'corporate', subTab: 'comsec', order: 3,
          question: { tc: '公司秘書須履行哪些職責？', en: 'What are the duties of a company secretary?', sc: '公司秘书须履行哪些职责？' },
          answer: { tc: '公司秘書的主要職責包括：保存法定紀錄及公司印章、安排及記錄董事會及股東會議、向公司註冊處提交法定文件，以及協助處理公司架構變動等。', en: 'Key duties include: maintaining statutory records and company seal, arranging and minuting board and shareholder meetings, filing statutory documents with the Companies Registry, and assisting with changes to company structure.', sc: '公司秘书的主要职责包括：保存法定记录及公司印章、安排及记录董事会及股东会议、向公司注册处提交法定文件，以及协助处理公司架构变动等。' } },
        { pageSlug: 'corporate', subTab: 'accounting', order: 1,
          question: { tc: '有限公司每年必須做審計嗎？', en: 'Must a limited company conduct an annual audit?', sc: '有限公司每年必须做审计吗？' },
          answer: { tc: '是的。香港《公司條例》規定，在港成立的有限公司每年須委聘香港執業會計師為公司賬目進行審計核驗，並向稅務局呈交審核財務報表。這是法定要求，不可豁免。', en: 'Yes. The Hong Kong Companies Ordinance requires limited companies to appoint a Hong Kong practising accountant annually to audit accounts and submit audited financial statements to the IRD. This statutory requirement cannot be waived.', sc: '是的。香港《公司条例》规定，在港成立的有限公司每年须委聘香港执业会计师为公司账目进行审计核验，并向税务局呈交审核财务报表。这是法定要求，不可豁免。' } },
        { pageSlug: 'corporate', subTab: 'accounting', order: 2,
          question: { tc: '財務記錄需要保存多久？', en: 'How long must financial records be kept?', sc: '财务记录需要保存多久？' },
          answer: { tc: '根據《稅務條例》第 51C 條，財務記錄須保留最少 7 年。未能遵辦而無合理辯解，最高罰款為 HK$100,000。', en: 'Under section 51C of the Inland Revenue Ordinance, financial records must be kept for at least 7 years. Failure to comply without reasonable excuse carries a maximum fine of HK$100,000.', sc: '根据《税务条例》第 51C 条，财务记录须保留最少 7 年。未能遵办而无合理辩解，最高罚款为 HK$100,000。' } },
        { pageSlug: 'corporate', subTab: 'accounting', order: 3,
          question: { tc: '利得稅報稅表何時需要提交？', en: 'When must profits tax returns be filed?', sc: '利得税报税表何时需要提交？' },
          answer: { tc: '新成立公司首份報稅表一般於成立後 18 個月內發出，其後每年於指定日期前提交。逾期提交可被罰款，嚴重情況下可被檢控。我們提供稅務申報全程代辦服務。', en: 'The first tax return for newly incorporated companies is generally issued within 18 months of incorporation, then annually by specified dates. Late filing may result in penalties or prosecution. We provide full tax return filing services.', sc: '新成立公司首份报税表一般于成立后 18 个月内发出，其后每年于指定日期前提交。逾期提交可被罚款，严重情况下可被检控。我们提供税务申报全程代办服务。' } },
        { pageSlug: 'corporate', subTab: 'deregistration', order: 1,
          question: { tc: '公司結業需要多長時間？', en: 'How long does company deregistration take?', sc: '公司结业需要多长时间？' },
          answer: { tc: '整個過程一般需時 6–12 個月，主要視乎稅務局處理不反對通知書的時間。如公司有未完成的稅務事宜，可能需要更長時間。', en: 'The entire process generally takes 6–12 months, mainly depending on the IRD processing time for the notice of no objection. Outstanding tax matters may extend this.', sc: '整个过程一般需时 6–12 个月，主要视乎税务局处理不反对通知书的时间。如公司有未完成的税务事宜，可能需要更长时间。' } },
        { pageSlug: 'corporate', subTab: 'deregistration', order: 2,
          question: { tc: '申請公司結業有什麼條件？', en: 'What are the conditions for applying for company deregistration?', sc: '申请公司结业有什么条件？' },
          answer: { tc: '申請自願結業的主要條件包括：公司所有成員同意結業、公司在申請前 3 個月內沒有進行任何業務，以及公司沒有未清還的債務或法律訴訟。', en: 'Main conditions include: all members consent to deregistration, the company has not conducted business in the 3 months prior to application, and has no outstanding debts or legal proceedings.', sc: '申请自愿结业的主要条件包括：公司所有成员同意结业、公司在申请前 3 个月内没有进行任何业务，以及公司没有未清还的债务或法律诉讼。' } },
      ],
    });
    console.log('✓ FAQs seeded');
  } else {
    console.log(`  FAQs already exist (${faqCount}), skipping`);
  }

  // ── ARTICLES ──────────────────────────────────────────────────
  const articleCount = await prisma.article.count();
  if (articleCount === 0) {
    const ctaLabel = { tc: '立即查詢', en: 'Enquire Now', sc: '立即查询' };
    await prisma.article.createMany({
      data: [
        {
          slug: 'sfc-2026-compliance-update',
          title: { tc: 'SFC 2026 年合規重點：持牌法團須留意的最新監管要求', en: 'SFC 2026 Compliance Focus: Latest Regulatory Requirements for Licensed Corporations', sc: 'SFC 2026 年合规重点：持牌法团须留意的最新监管要求' },
          excerpt: { tc: 'SFC 近期發出多份合規通函，重點關注持牌法團的客戶資產保障、網絡安全措施及利益衝突管理。本文整理最新監管方向及應對建議。', en: 'The SFC has recently issued multiple compliance circulars focusing on client asset protection, cybersecurity measures and conflict of interest management for licensed corporations.', sc: 'SFC 近期发出多份合规通函，重点关注持牌法团的客户资产保障、网络安全措施及利益冲突管理。本文整理最新监管方向及应对建议。' },
          body: { tc: '<p>香港證券及期貨事務監察委員會 (SFC) 近期發出多份合規通函，重點關注持牌法團在以下範疇的合規情況：</p><ul><li><strong>客戶資產保障措施強化要求</strong> — SFC 要求持牌法團確保客戶資產與公司自有資產嚴格分隔，並定期進行對賬核實。</li><li><strong>網絡安全事故匯報機制更新</strong> — 持牌法團須於發現重大網絡安全事故後 7 個工作天內向 SFC 匯報，並制定完善的應急響應計劃。</li><li><strong>虛擬資產相關持牌活動監管框架</strong> — SFC 就持牌法團提供虛擬資產相關服務的範圍及要求作出進一步澄清。</li><li><strong>CPT 要求執行監察加強</strong> — SFC 加強對持牌代表持續專業培訓合規情況的監察。</li></ul><p>持牌法團應盡快審視現行合規框架，確保符合 SFC 最新要求。</p>', en: '<p>The Securities and Futures Commission (SFC) has recently issued multiple compliance circulars focusing on: enhanced client asset protection requirements, updated cybersecurity incident reporting, virtual asset-related licensed activities framework, and enhanced CPT compliance monitoring.</p><p>Licensed corporations should review their current compliance frameworks promptly to ensure they meet the SFC\'s latest requirements. Please contact Sandbox Group for assistance.</p>', sc: '<p>香港证券及期货事务监察委员会 (SFC) 近期发出多份合规通函，重点关注持牌法团在以下范畴的合规情况：</p><ul><li><strong>客户资产保障措施强化要求</strong></li><li><strong>网络安全事故汇报机制更新</strong></li><li><strong>虚拟资产相关持牌活动监管框架</strong></li><li><strong>CPT 要求执行监察加强</strong></li></ul><p>持牌法团应尽快审视现行合规框架，确保符合 SFC 最新要求。</p>' },
          category: { tc: 'SFC 監管動向', en: 'SFC Regulatory Update', sc: 'SFC 监管动向' },
          ctaLabel, published: true, publishedAt: new Date('2026-05-01'), order: 1,
        },
        {
          slug: 'cstb-mso-2026-inspection-trends',
          title: { tc: '香港海關 (CSTB) MSO 監管更新：2026 年新申請要求及現場審查趨勢', en: 'HK Customs (CSTB) MSO Regulatory Update: 2026 New Application Requirements and Inspection Trends', sc: '香港海关 (CSTB) MSO 监管更新：2026 年新申请要求及现场审查趋势' },
          excerpt: { tc: '香港海關在 MSO 牌照審批及現場審查方面有明顯收緊趨勢。本文分析海關近期審查重點，並提供申請人應對建議。', en: 'Hong Kong Customs has significantly tightened MSO licence approvals and on-site inspections. This article analyses recent inspection focuses and provides guidance for applicants.', sc: '香港海关在 MSO 牌照审批及现场审查方面有明显收紧趋势。本文分析海关近期审查重点，并提供申请人应对建议。' },
          body: { tc: '<p>香港海關關稅及邊境保護局 (CSTB) 近期在 MSO 牌照審批及現場審查方面有明顯收緊趨勢，重點審查：CDD 執行一致性、STR 報告質量、員工 AML 培訓紀錄完整性，以及高風險客戶及地區的加強盡職審查。</p><p>建議 MSO 持牌人定期進行內部合規自查，確保 AML/CFT 框架符合海關最新要求。</p>', en: '<p>The CSTB has significantly tightened MSO licence approvals and on-site inspections, focusing on: CDD implementation consistency, STR report quality, completeness of staff AML training records, and enhanced due diligence for high-risk clients and jurisdictions.</p><p>MSO licence holders are advised to conduct regular internal compliance reviews to ensure their AML/CFT frameworks meet the latest requirements.</p>', sc: '<p>香港海关关税及边境保护局 (CSTB) 近期在 MSO 牌照审批及现场审查方面有明显收紧趋势，重点审查：CDD 执行一致性、STR 报告质量、员工 AML 培训记录完整性，以及高风险客户及地区的加强尽职审查。</p><p>建议 MSO 持牌人定期进行内部合规自查，确保 AML/CFT 框架符合海关最新要求。</p>' },
          category: { tc: 'MSO / 海關', en: 'MSO / Customs', sc: 'MSO / 海关' },
          ctaLabel, published: true, publishedAt: new Date('2026-04-15'), order: 2,
        },
        {
          slug: 'fatf-2025-26-recommendations-hong-kong',
          title: { tc: 'FATF 2025/26 最新建議更新：對香港金融機構的實際影響', en: 'FATF 2025/26 Latest Recommendations Update: Practical Impact on Hong Kong Financial Institutions', sc: 'FATF 2025/26 最新建议更新：对香港金融机构的实际影响' },
          excerpt: { tc: 'FATF 於 2025 年更新多項關於受益所有人透明度、虛擬資產監管及非金融業務的建議，本文解析對香港企業的影響。', en: 'FATF updated multiple recommendations on beneficial ownership transparency, virtual asset regulation and non-financial businesses in 2025.', sc: 'FATF 于 2025 年更新多项关于受益所有人透明度、虚拟资产监管及非金融业务的建议，本文解析对香港企业的影响。' },
          body: { tc: '<p>金融行動特別工作組 (FATF) 於 2025 年更新了多項重要建議，主要涵蓋：受益所有人透明度要求強化、虛擬資產旅行規則執行、指定非金融業務 (DNFBP) 監管，以及高風險名單更新。</p><p>金融機構須相應調整其風險評估框架及盡職審查措施。</p>', en: '<p>FATF updated several important recommendations in 2025, covering: enhanced beneficial ownership transparency, virtual asset Travel Rule implementation, DNFBP regulation, and high-risk jurisdiction list updates.</p><p>Financial institutions must adjust their risk assessment frameworks and due diligence measures accordingly.</p>', sc: '<p>金融行动特别工作组 (FATF) 于 2025 年更新了多项重要建议，主要涵盖：受益所有人透明度要求强化、虚拟资产旅行规则执行、指定非金融业务 (DNFBP) 监管，以及高风险名单更新。</p><p>金融机构须相应调整其风险评估框架及尽职审查措施。</p>' },
          category: { tc: '全球 AML', en: 'Global AML', sc: '全球 AML' },
          ctaLabel, published: true, publishedAt: new Date('2026-04-01'), order: 3,
        },
        {
          slug: 'global-vasp-regulatory-comparison-2026',
          title: { tc: '全球虛擬資產監管格局 2026：香港、新加坡、歐盟與美國比較', en: 'Global VASP Regulatory Landscape 2026: Comparing Hong Kong, Singapore, EU and US', sc: '全球虚拟资产监管格局 2026：香港、新加坡、欧盟与美国比较' },
          excerpt: { tc: '虛擬資產監管在各主要司法管轄區的快速發展為 VASP 帶來機遇與挑戰，本文比較各地最新框架及市場進入策略。', en: 'The rapid development of virtual asset regulation across major jurisdictions brings opportunities and challenges for VASPs. This article compares the latest frameworks and market entry strategies.', sc: '虚拟资产监管在各主要司法管辖区的快速发展为 VASP 带来机遇与挑战，本文比较各地最新框架及市场进入策略。' },
          body: { tc: '<p>2026 年全球虛擬資產監管框架持續演進：香港 SFC VASP 牌照制度框架清晰；新加坡 MAS 審批嚴格，獲批率較低；歐盟 MiCA 提供統一框架但合規要求繁複；美國則聯邦及州層面監管並存，市場進入成本高。</p><p>選擇合適的司法管轄區需平衡市場規模、監管清晰度、合規成本及業務計劃。</p>', en: '<p>The global VASP regulatory landscape continues to evolve in 2026: Hong Kong SFC VASP licensing offers regulatory clarity; Singapore MAS approval is strict with low approval rates; EU MiCA provides unified regulation across 27 member states but compliance is complex; the US has parallel federal/state frameworks with high entry costs.</p><p>Choosing the right jurisdiction requires balancing market size, regulatory clarity, compliance costs and business plans.</p>', sc: '<p>2026 年全球虚拟资产监管框架持续演进：香港 SFC VASP 牌照制度框架清晰；新加坡 MAS 审批严格，获批率较低；欧盟 MiCA 提供统一框架但合规要求繁复；美国则联邦及州层面监管并存，市场进入成本高。</p><p>选择合适的司法管辖区需平衡市场规模、监管清晰度、合规成本及业务计划。</p>' },
          category: { tc: '虛擬資產監管', en: 'Virtual Asset Regulation', sc: '虚拟资产监管' },
          ctaLabel, published: true, publishedAt: new Date('2026-03-15'), order: 4,
        },
        {
          slug: 'ia-insurance-aml-2026-update',
          title: { tc: '保險業監管局 (IA) 2026 年合規更新：保險中介人的 AML 新要求', en: 'Insurance Authority (IA) 2026 Compliance Update: New AML Requirements for Insurance Intermediaries', sc: '保险业监管局 (IA) 2026 年合规更新：保险中介人的 AML 新要求' },
          excerpt: { tc: 'IA 於 2026 年發出多項有關保險中介人 AML/CFT 合規的指引，本文解析主要影響及應對措施。', en: 'The IA issued multiple guidelines on AML/CFT compliance for insurance intermediaries in 2026. This article analyses the key impacts and response measures.', sc: 'IA 于 2026 年发出多项有关保险中介人 AML/CFT 合规的指引，本文解析主要影响及应对措施。' },
          body: { tc: '<p>保險業監管局 (IA) 於 2026 年初發出多份 AML/CFT 合規指引更新，主要涵蓋：客戶盡職審查 (CDD) 執行要求、可疑交易識別及匯報、員工培訓要求，以及制裁篩查要求。</p><p>保險中介人應盡快審視並更新其 AML/CFT 政策及程序，以符合 IA 最新要求。</p>', en: '<p>The Insurance Authority (IA) issued multiple AML/CFT compliance guideline updates in early 2026, covering: CDD implementation requirements, suspicious transaction reporting, staff training requirements, and sanctions screening.</p><p>Insurance intermediaries should review and update their AML/CFT policies and procedures promptly.</p>', sc: '<p>保险业监管局 (IA) 于 2026 年初发出多份 AML/CFT 合规指引更新，主要涵盖：客户尽职审查 (CDD) 执行要求、可疑交易识别及汇报、员工培训要求，以及制裁筛查要求。</p><p>保险中介人应尽快审视并更新其 AML/CFT 政策及程序，以符合 IA 最新要求。</p>' },
          category: { tc: '保險監管', en: 'Insurance Regulation', sc: '保险监管' },
          ctaLabel, published: true, publishedAt: new Date('2026-03-01'), order: 5,
        },
        {
          slug: 'dpms-moneylenders-compliance-2026',
          title: { tc: '香港 DPMS 及放債人合規指引更新 2026：不可忽視的監管重點', en: 'Hong Kong DPMS and Money Lender Compliance Guidelines Update 2026: Key Regulatory Points', sc: '香港 DPMS 及放债人合规指引更新 2026：不可忽视的监管重点' },
          excerpt: { tc: '海關對 DPMS（貴重金屬及寶石買賣商）及稅務局對放債人的合規要求持續更新，本文整理 2026 年主要變化。', en: "Customs' compliance requirements for DPMS and IRD's requirements for money lenders continue to be updated. This article outlines the key 2026 changes.", sc: '海关对 DPMS（贵重金属及宝石买卖商）及税务局对放债人的合规要求持续更新，本文整理 2026 年主要变化。' },
          body: { tc: '<p>2026 年 DPMS 及放債人合規要求主要更新：DPMS 須向香港海關登記，HK$120,000 或以上現金交易須進行 CDD；放債人牌照須每年向法院申請續期，並遵守《放債人條例》規定的利率上限。</p>', en: '<p>2026 compliance updates for DPMS and money lenders: DPMS must register with Hong Kong Customs; cash transactions of HK$120,000+ require CDD; money lender licences must be renewed annually through the court and comply with the interest rate caps under the Money Lenders Ordinance.</p>', sc: '<p>2026 年 DPMS 及放债人合规要求主要更新：DPMS 须向香港海关登记，HK$120,000 或以上现金交易须进行 CDD；放债人牌照须每年向法院申请续期，并遵守《放债人条例》规定的利率上限。</p>' },
          category: { tc: 'DPMS / 放債人', en: 'DPMS / Money Lenders', sc: 'DPMS / 放债人' },
          ctaLabel, published: true, publishedAt: new Date('2026-02-15'), order: 6,
        },
      ],
    });
    console.log('✓ Articles seeded');
  } else {
    console.log(`  Articles already exist (${articleCount}), skipping`);
  }

  console.log('\n✅ All content seeded successfully!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
