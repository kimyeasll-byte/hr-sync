import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Colors
    COLOR_BG = RGBColor(248, 249, 250)         # #F8F9FA
    COLOR_CARD = RGBColor(255, 255, 255)       # #FFFFFF
    COLOR_PRIMARY = RGBColor(0, 113, 227)      # #0071E3 (Apple Blue)
    COLOR_NAVY = RGBColor(15, 23, 42)          # #0F172A
    COLOR_TEXT = RGBColor(30, 41, 59)          # #1E293B
    COLOR_MUTED = RGBColor(100, 116, 139)      # #64748B
    COLOR_BORDER = RGBColor(226, 232, 240)     # #E2E8F0
    COLOR_EMERALD = RGBColor(16, 185, 129)     # #10B981
    COLOR_AMBER = RGBColor(245, 158, 11)       # #F59E0B
    COLOR_ROSE = RGBColor(239, 68, 68)         # #EF4444

    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category="WORKSHOP SESSIONS"):
        # Category Badge
        cat_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.6), Inches(2.8), Inches(0.35))
        cat_box.fill.solid()
        cat_box.fill.fore_color.rgb = RGBColor(235, 245, 255)
        cat_box.line.color.rgb = RGBColor(186, 230, 253)
        cat_tf = cat_box.text_frame
        cat_tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p_c = cat_tf.paragraphs[0]
        p_c.text = f"• {category}"
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = COLOR_PRIMARY
        p_c.font.name = "Malgun Gothic"

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = COLOR_NAVY
        p.font.name = "Malgun Gothic"

    def add_speaker_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # ==========================================
    # SLIDE 1: 표지
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)

    # Hero Banner Container
    hero = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(10.9), Inches(5.1))
    hero.fill.solid()
    hero.fill.fore_color.rgb = COLOR_CARD
    hero.line.color.rgb = COLOR_BORDER
    hero.line.width = Pt(1.5)

    # Hero Content
    tb = s1.shapes.add_textbox(Inches(1.8), Inches(1.8), Inches(9.7), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "사내 업무 혁신을 위한 AI 엔지니어링 워크숍"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PRIMARY
    p0.font.name = "Malgun Gothic"
    p0.space_after = Pt(16)

    p1 = tf.add_paragraph()
    p1.text = "아이디어만 있으면 3일 만에\n실제 웹 서비스를 만드는 법"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.font.name = "Malgun Gothic"
    p1.space_after = Pt(20)

    p2 = tf.add_paragraph()
    p2.text = "코딩 문법 대신 AI를 내 파트너(Pair Programmer)로 부리는 5단계 실전 가이드"
    p2.font.size = Pt(16)
    p2.font.color.rgb = COLOR_MUTED
    p2.font.name = "Malgun Gothic"
    p2.space_after = Pt(30)

    p3 = tf.add_paragraph()
    p3.text = "발표자: (주)파워넷 인사기획팀 / HR Sync 개발 TF"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_TEXT
    p3.font.name = "Malgun Gothic"

    add_speaker_notes(s1, "안녕하세요, 팀원 여러분! 오늘 워크숍의 제목은 '아이디어만 있으면 누구나 웹서비스를 만드는 법'입니다. 오늘 파이썬이나 자바스크립트 문법은 단 한 줄도 외우지 않습니다. 대신 우리가 매일 겪는 귀찮은 업무를 AI라는 천재 개발자에게 명확하게 지시해서 단 며칠 만에 실제 서비스로 만들어내는 디렉팅 방법을 마스터하실 겁니다!")

    # ==========================================
    # SLIDE 2: 문제 제기
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "우리의 하루는 왜 엑셀과 카톡으로 끝나는가?", "PART 1. PROBLEM SHARING")

    # Card 1: 현실의 고통
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.8))
    c1.fill.solid()
    c1.fill.fore_color.rgb = COLOR_CARD
    c1.line.color.rgb = COLOR_BORDER
    tf1 = c1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "❌ 엑셀 수작업과 사내 IT의 현실"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_ROSE
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(16)

    bullets1 = [
        "• 입퇴사, 비품 대여, 일정 취합, 경비 정산의 무한 반복",
        "• 전산팀 요청 시: '우선순위 밀렸습니다. 6개월 대기'",
        "• 외주 SI 개발 견적: 수천만 원 & 긴 승인 과정",
        "• 결국 담당자는 오늘도 엑셀을 열고 야근 시작..."
    ]
    for b in bullets1:
        pb = tf1.add_paragraph()
        pb.text = b
        pb.font.size = Pt(13)
        pb.font.color.rgb = COLOR_TEXT
        pb.font.name = "Malgun Gothic"
        pb.space_after = Pt(10)

    # Card 2: 3분 참여 활동
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(4.8))
    c2.fill.solid()
    c2.fill.fore_color.rgb = RGBColor(239, 246, 255)
    c2.line.color.rgb = RGBColor(191, 219, 254)
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "💬 3분 참여 미션: 슬랙/채팅창에 적어주세요!"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(16)

    bullets2 = [
        "\"내 업무 중 가장 전산화하고 싶은 귀찮은 일 1가지\"",
        "",
        "예시:",
        "1. 법인차량 / 회의실 실시간 예약 및 중복 방지",
        "2. 신규 입사자 PC/계정/출입증 원터치 배정",
        "3. 표준 계약서 필수 조항 자동 검토",
        "4. 영수증 사진 업로드 & OCR 경비 정산",
        "",
        "👉 지금 채팅창에 남겨주신 아이디어가 오늘 실습의 재료가 됩니다!"
    ]
    for b in bullets2:
        pb = tf2.add_paragraph()
        pb.text = b
        pb.font.size = Pt(12)
        pb.font.color.rgb = COLOR_NAVY if b.startswith("예시") or b.startswith("\"") else COLOR_TEXT
        pb.font.bold = b.startswith("👉") or b.startswith("1.") or b.startswith("2.") or b.startswith("3.") or b.startswith("4.")
        pb.font.name = "Malgun Gothic"
        pb.space_after = Pt(4)

    add_speaker_notes(s2, "우리가 회사에서 일하다 보면 이런 생각 진짜 많이 하죠. 지금 채팅창에 여러분이 매일 하면서 귀찮은 업무 하나씩만 남겨주세요. 그 아이디어가 오늘 우리 실습의 진짜 주인공이 될 겁니다!")

    # ==========================================
    # SLIDE 3: 패러다임 전환
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "코더(Coder)가 아닌 디렉터(Director)가 되자", "PART 2. PARADIGM SHIFT")

    # Left Container: 과거
    box_l = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.8))
    box_l.fill.solid()
    box_l.fill.fore_color.rgb = COLOR_CARD
    box_l.line.color.rgb = COLOR_BORDER
    tfl = box_l.text_frame
    tfl.word_wrap = True
    p = tfl.paragraphs[0]
    p.text = "과거: 개발자가 왕이었던 시대"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_MUTED
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(14)

    tfl_items = [
        "• 문법(Syntax)을 외워야 서비스 개발 가능",
        "• 기획자 ➔ 디자이너 ➔ 개발자 ➔ QA의 긴 파이프라인",
        "• 수정 한 번 하려면 개발자 눈치 봐야 함",
        "• 현업의 맥락을 모르는 개발자가 엉뚱한 화면을 만듦"
    ]
    for item in tfl_items:
        pi = tfl.add_paragraph()
        pi.text = item
        pi.font.size = Pt(13)
        pi.font.color.rgb = COLOR_TEXT
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(10)

    # Right Container: 현재 AI 시대
    box_r = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(4.8))
    box_r.fill.solid()
    box_r.fill.fore_color.rgb = RGBColor(240, 253, 244)
    box_r.line.color.rgb = RGBColor(187, 247, 208)
    tfr = box_r.text_frame
    tfr.word_wrap = True
    p = tfr.paragraphs[0]
    p.text = "현재: 업무를 아는 기획자가 왕인 시대"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(14)

    tfr_items = [
        "• 코딩은 AI가 1초 만에 100줄씩 대신 작성",
        "• 진짜 중요한 것: '업무 규칙과 사용자 동선 정의'",
        "• 현업 실무자 = AI 개발팀을 지휘하는 수석 PM",
        "• '이 버튼 위치 바꿔줘', '엑셀 다운로드 추가해줘'로 즉시 개선"
    ]
    for item in tfr_items:
        pi = tfr.add_paragraph()
        pi.text = item
        pi.font.size = Pt(13)
        pi.font.color.rgb = COLOR_NAVY
        pi.font.bold = True
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(10)

    add_speaker_notes(s3, "AI 시대에는 공식이 완전히 바뀌었습니다. 코딩은 AI가 1초 만에 짭니다. 진짜 중요한 건 사내 업무 룰과 사용자 동선입니다. 여러분은 코더가 아니라 AI 개발팀을 거느린 수석 PM입니다!")

    # ==========================================
    # SLIDE 4: 6단계 로드맵
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "웹서비스 제작 6단계 엔드투엔드(End-to-End) 지도", "PART 2. THE BLUEPRINT")

    steps = [
        ("0단계", "아이디어 발제", "현업의 고통과 비효율 털어놓기"),
        ("1단계", "AI 심층 역인터뷰", "AI가 나를 인터뷰해 빈틈을 파냄"),
        ("2단계", "도메인 & PRD 문서", "할 일과 안 할 일의 경계 긋기"),
        ("3단계", "UX/UI 디자인 토큰", "애플 스타일 라이트 모드 규칙"),
        ("4단계", "기술 아키텍처 (ADR)", "무료 클라우드 스택 (0원) 결정"),
        ("5단계", "점진적 구현 (Iteration)", "벽돌 쌓듯이 5일 만에 완성")
    ]

    for i, (st, title, desc) in enumerate(steps):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 3.95)
        top = Inches(1.9 + row * 2.5)

        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = st
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NAVY
        p2.font.name = "Malgun Gothic"
        p2.space_after = Pt(6)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(11)
        p3.font.color.rgb = COLOR_MUTED
        p3.font.name = "Malgun Gothic"

    add_speaker_notes(s4, "우리가 실제로 밟았던 6단계 지도입니다. 많은 분들이 아이디어에서 바로 코딩으로 점프하다 망합니다. 가장 중요한 마법은 1단계, AI에게 나를 인터뷰하게 만드는 기술입니다.")

    # ==========================================
    # SLIDE 5: 1급 비밀: AI 심층 역인터뷰
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "1급 비밀: AI에게 나를 집요하게 취조(Grill-Me)하게 하라", "PART 2. CORE METHOD")

    # Prompt Box
    pbox = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(2.2))
    pbox.fill.solid()
    pbox.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pbox.line.color.rgb = COLOR_NAVY
    ptf = pbox.text_frame
    ptf.word_wrap = True

    p = ptf.paragraphs[0]
    p.text = "🎯 마법의 인터뷰 요청 프롬프트 (Golden Prompt)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(6)

    p_body = ptf.add_paragraph()
    p_body.text = "\"너는 15년 차 수석 프로덕트 매니저(PM)이자 아키텍트야. 내가 말한 아이디어를 웹서비스로 만들기 위해 필요한 질문을 나에게 5개씩 던져줘. 기술 용어 쓰지 말고, 현업의 업무 프로세스, 대상 사용자, 예외 상황에 대해 나를 인터뷰해줘. 내 답변을 들은 뒤 다음 질문을 해.\""
    p_body.font.size = Pt(12)
    p_body.font.color.rgb = RGBColor(241, 245, 249)
    p_body.font.name = "Malgun Gothic"

    # 3 Example Cards below
    ex_items = [
        ("질문 1. 사업장과 도메인은?", "➔ 수원 연구소, 서울 본사 2곳이며 @gopowernet.com 체계 도출"),
        ("질문 2. 화면 분리는 어떻게?", "➔ 신입사원은 스마트폰 모바일 포털, 관리자는 PC 대시보드로 분리"),
        ("질문 3. 설문 주기는 언제?", "➔ 첫날엔 필요 없고, 1M/3M/6M/1Y 주기로 이메일 자동 발송")
    ]
    for i, (q, a) in enumerate(ex_items):
        cx = Inches(0.8 + i * 3.95)
        cy = Inches(4.3)
        c = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, cy, Inches(3.7), Inches(2.4))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_BORDER
        ctf = c.text_frame
        ctf.word_wrap = True

        p1 = ctf.paragraphs[0]
        p1.text = q
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"
        p1.space_after = Pt(8)

        p2 = ctf.add_paragraph()
        p2.text = a
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT
        p2.font.name = "Malgun Gothic"

    add_speaker_notes(s5, "비개발자는 본인이 뭘 모르는지 모릅니다. 그래서 AI에게 역으로 나를 집요하게 인터뷰해달라고 해야 합니다. 이 질문에 답을 하다 보면 머릿속의 안개가 걷힙니다.")

    # ==========================================
    # SLIDE 6: PRD로 선 긋기
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "PRD로 선 긋기: 할 일(In-Scope)과 안 할 일(Out-of-Scope)", "PART 2. PRD PHASE")

    col_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.8))
    col_l.fill.solid()
    col_l.fill.fore_color.rgb = COLOR_CARD
    col_l.line.color.rgb = COLOR_BORDER
    tfl = col_l.text_frame
    tfl.word_wrap = True
    p = tfl.paragraphs[0]
    p.text = "⭕ 이번에 반드시 해결할 일 (In-Scope)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(12)

    in_items = [
        "1. 원터치 계정 & 사번 자동 발급 (다우오피스/SSO)",
        "2. IT 장비 3종(노트북, 모니터, 출입증) 자동 배정",
        "3. 신입사원 Day-1 모바일 포털 (준비물, 사진 접수)",
        "4. 4단계 펄스 서베이 & AI 조기퇴사 위험 신호 분석",
        "5. 퇴사 시 원클릭 계정 차단 & 자산 일괄 반납"
    ]
    for it in in_items:
        pi = tfl.add_paragraph()
        pi.text = it
        pi.font.size = Pt(12)
        pi.font.color.rgb = COLOR_TEXT
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(8)

    col_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(4.8))
    col_r.fill.solid()
    col_r.fill.fore_color.rgb = COLOR_CARD
    col_r.line.color.rgb = COLOR_BORDER
    tfr = col_r.text_frame
    tfr.word_wrap = True
    p = tfr.paragraphs[0]
    p.text = "❌ 이번에 절대 안 할 일 (Out-of-Scope)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_ROSE
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(12)

    out_items = [
        "1. 실물 택배 배송 실시간 트래킹 (과도한 복잡도)",
        "2. 사내 급여/퇴직금 자동 연동 (인사 보안 정책)",
        "3. 대면 OJT 동영상 스트리밍 플랫폼 구축",
        "",
        "💡 성공의 비결: 욕심부리지 않고 안 할 일을 확실히 쳐내야 3일 만에 완성할 수 있습니다!"
    ]
    for it in out_items:
        pi = tfr.add_paragraph()
        pi.text = it
        pi.font.size = Pt(12)
        pi.font.color.rgb = COLOR_ROSE if it.startswith("💡") else COLOR_TEXT
        pi.font.bold = it.startswith("💡")
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(8)

    add_speaker_notes(s6, "프로젝트가 망하는 1위 원인은 '이것도 넣고 저것도 넣자'입니다. 안 할 일을 확실히 쳐내야 3일 만에 배포할 수 있습니다.")

    # ==========================================
    # SLIDE 7: 디자인 룰
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "디자인 룰 먼저 박기: 애플 스타일 라이트 모드", "PART 2. DESIGN RULES")

    rule_items = [
        ("규칙 1. 배경 & 표면 대비", "배경: 소프트 라이트 그레이 (#F5F5F7)\n카드/표면: 순백색 (#FFFFFF)\n부드럽고 눈이 편안한 전문가용 캔버스"),
        ("규칙 2. 포인트 컬러 (Accent)", "핵심 액션: 애플 시스템 블루 (#0071E3)\n성공/완료: 에메랄드 그린 (#10B981)\n주의/경고: 로즈 레드 (#EF4444)"),
        ("규칙 3. 형태 및 아이콘", "모서리 둥글기: 12px ~ 16px (Card Radius)\n아이콘: Lucide Icons 일관 적용\n그리드: 4px 단위 패딩 & 마진")
    ]

    for i, (rt, rd) in enumerate(rule_items):
        cx = Inches(0.8 + i * 3.95)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.9), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = rt
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"
        p1.space_after = Pt(14)

        p2 = tf.add_paragraph()
        p2.text = rd
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_TEXT
        p2.font.name = "Malgun Gothic"

    add_speaker_notes(s7, "디자인 감각이 없어도 됩니다. AI에게 딱 3단어만 던지세요. 'Apple 스타일, 라이트 그레이 배경, 카드형 UI'. 규칙을 미리 정해주면 AI가 페이지를 10개 만들어도 일관되게 세련됩니다.")

    # ==========================================
    # SLIDE 8: 실습 1 (파워넷 HR Sync 투어)
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "실습 1 (Hands-on): 파워넷 HR Sync 10분 투어", "PART 3. HANDS-ON DEMO")

    # Banner
    bann = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(1.0))
    bann.fill.solid()
    bann.fill.fore_color.rgb = RGBColor(239, 246, 255)
    bann.line.color.rgb = RGBColor(191, 219, 254)
    btf = bann.text_frame
    btf.word_wrap = True
    p = btf.paragraphs[0]
    p.text = "🌐 지금 브라우저를 열고 접속하세요! 👉 https://hr-sync-delta.vercel.app"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_PRIMARY
    p.font.name = "Malgun Gothic"
    p.alignment = PP_ALIGN.CENTER

    missions = [
        ("미션 1. 원터치 입사 실행", "우측 상단 [🚀 연구소 HW개발] 프리셋 클릭 ➔ [⚡ 원터치 입사 자동화 일괄 실행] 클릭! 1초 만에 사번, 이메일, 장비, 고정 IP가 배정되는 5단계 콘솔 확인!"),
        ("미션 2. 신입사원 모바일 포털", "완료 카드의 [📱 모바일 포털 바로 열기] 클릭! 첫 출근 D-Day, 제휴 사진관(패밀리포토하우스) 네이버 지도, 사원증 촬영, 12대 복리후생 탐색 후 각오 전송!"),
        ("미션 3. 관리자 실시간 접수 & AI", "[온보딩 여정] 탭 이동 ➔ 좌측 입사자 클릭 ➔ 방금 보낸 사원증 사진 원본 다운로드 & AI 피플 애널리틱스 조기퇴사 위험 신호(Red Flag) 분석 확인!"),
        ("미션 4. 원터치 퇴사 처리", "[퇴사자 권한 회수] 탭 ➔ 직원 선택 ➔ [🚨 원터치 종합 퇴사 즉시 실행] 클릭! 계정 즉시 잠금 + 자산 100% 일괄 반납(RETURNED) + [🖨️ A4 퇴사 확인서] 인쇄 확인!")
    ]

    for i, (mt, md) in enumerate(missions):
        row = i // 2
        col = i % 2
        left = Inches(0.8 + col * 5.95)
        top = Inches(3.0 + row * 2.0)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(5.7), Inches(1.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = mt
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY
        p1.font.name = "Malgun Gothic"
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = md
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT
        p2.font.name = "Malgun Gothic"

    add_speaker_notes(s8, "백문이 불여일견입니다. 지금 노트북을 여시고 주소로 접속해주세요! 로그인 없이 바로 열리고 가이드 팝업이 뜹니다. 미션 1번부터 4번까지 직접 눌러보세요!")

    # ==========================================
    # SLIDE 9: 기술 아키텍처 (0원 스택)
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "이 모든 게 0원(무료)으로 돌아간다고?", "PART 3. TECH STACK")

    tech_cards = [
        ("Next.js 16 (App Router)", "초고속 모던 웹 프레임워크", "• React 19 기반 반응형 웹\n• PC/태블릿/모바일 완벽 지원\n• Turbopack 번들러로 0.8초 빌드"),
        ("Supabase (PostgreSQL)", "무료 클라우드 데이터베이스", "• 글로벌 1위 오픈소스 DB\n• 실시간 데이터 영구 보존\n• 강력한 보안(RLS) 및 Admin API"),
        ("Vercel Edge Cloud", "클릭 한 번에 전 세계 배포", "• GitHub 푸시 시 30초 무중단 배포\n• 글로벌 CDN 초고속 로딩\n• 도메인 자동 발급 (HTTPS 지원)"),
        ("Resend Email API", "신입사원 알림장 자동 발송", "• 매달 3,000건 무료 이메일\n• 웰컴 메일 및 모바일 포털 링크\n• 회차별 설문 안내장 실시간 발송")
    ]

    for i, (tt, ts, td) in enumerate(tech_cards):
        cx = Inches(0.8 + i * 2.95)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.9), Inches(2.75), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = tt
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"

        p2 = tf.add_paragraph()
        p2.text = ts
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_MUTED
        p2.font.name = "Malgun Gothic"
        p2.space_after = Pt(12)

        p3 = tf.add_paragraph()
        p3.text = td
        p3.font.size = Pt(11)
        p3.font.color.rgb = COLOR_TEXT
        p3.font.name = "Malgun Gothic"

    add_speaker_notes(s9, "많은 분들이 '이런 거 만들면 서버비 얼마 나와요?' 물어보십니다. 놀랍게도 현재 서버 유지비는 0원입니다. 회사 예산 결재 품의 올릴 필요 없이 내 아이디어를 무료로 검증할 수 있습니다.")

    # ==========================================
    # SLIDE 10: 실습 2 (2인 1조 기획서 뽑기)
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "실습 2 (Hands-on): 2인 1조 '내 업무 기획서 10분 만에 뽑기'", "PART 4. TEAM WORKSHOP")

    pbox2 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(11.7), Inches(2.2))
    pbox2.fill.solid()
    pbox2.fill.fore_color.rgb = RGBColor(30, 41, 59)
    pbox2.line.color.rgb = COLOR_NAVY
    tf = pbox2.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "📋 짝꿍과 함께 AI에게 복사해 넣을 프롬프트 (ChatGPT / Claude / Gemini 열기)"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(8)

    p_b = tf.add_paragraph()
    p_b.text = "\"나는 [우리 부서명] 담당자야. 우리 팀의 [아까 채팅창에 쓴 귀찮은 업무]를 웹 시스템으로 만들고 싶어. 너는 15년 차 수석 PM이야. 기술 용어 쓰지 말고, 현업의 업무 프로세스를 파악하기 위한 질문 3가지만 나에게 해줘.\""
    p_b.font.size = Pt(12)
    p_b.font.color.rgb = RGBColor(241, 245, 249)
    p_b.font.name = "Malgun Gothic"

    # Action steps below
    ast = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(4.3), Inches(11.7), Inches(2.4))
    ast.fill.solid()
    ast.fill.fore_color.rgb = COLOR_CARD
    ast.line.color.rgb = COLOR_BORDER
    atf = ast.text_frame
    atf.word_wrap = True

    p = atf.paragraphs[0]
    p.text = "⏱️ 실습 순서 (총 10분 진행)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(8)

    items = [
        "1. AI 챗봇을 열고 위 프롬프트를 붙여넣는다. (1분)",
        "2. AI가 던진 3가지 질문에 짝꿍과 상의하여 답을 적어준다. (4분)",
        "3. 답변 후: \"이 내용을 바탕으로 1장짜리 PRD(제품 요구사항 정의서)를 작성해줘\"라고 요청한다. (2분)",
        "4. 완성된 기획서를 확인하고 팀원들과 나눌 핵심 아이디어를 정리한다. (3분)"
    ]
    for it in items:
        pi = atf.add_paragraph()
        pi.text = it
        pi.font.size = Pt(12)
        pi.font.color.rgb = COLOR_TEXT
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(4)

    add_speaker_notes(s10, "이제 여러분 차례입니다! 짝꿍과 2인 1조가 되어 슬라이드의 프롬프트를 AI에게 던져보세요. 10분 뒤에 여러분만의 1장짜리 PRD가 완성될 겁니다. 타이머 시작합니다!")

    # ==========================================
    # SLIDE 11: 실습 결과 공유
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "실습 결과 공유: 우리가 10분 만에 만든 것들", "PART 5. SHARING")

    share_cards = [
        ("총무팀 아이디어", "법인차량 중복 예약 방지 포털", "• 모바일 캘린더 실시간 차량 현황\n• 미반납 시 카톡 알림 자동 발송\n• 유류비 영수증 자동 집계"),
        ("영업팀 아이디어", "1초 원클릭 PDF 견적서 생성기", "• 고객사 및 수량 선택 시 단가 자동 계산\n• 회사 직인이 찍힌 A4 PDF 즉시 출력\n• 견적 이력 엑셀 다운로드"),
        ("법무/계약 아이디어", "표준 계약서 필수 조항 체크 웹", "• 계약서 PDF 드래그앤드롭 업로드\n• AI가 필수 누락 조항 3단계 검토\n• 독소 조항 발견 시 경고 배너 표시")
    ]
    for i, (st, sn, sd) in enumerate(share_cards):
        cx = Inches(0.8 + i * 3.95)
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.9), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = st
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"

        p2 = tf.add_paragraph()
        p2.text = sn
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_NAVY
        p2.font.name = "Malgun Gothic"
        p2.space_after = Pt(12)

        p3 = tf.add_paragraph()
        p3.text = sd
        p3.font.size = Pt(12)
        p3.font.color.rgb = COLOR_TEXT
        p3.font.name = "Malgun Gothic"

    add_speaker_notes(s11, "자, 어느 팀에서 먼저 자랑해주실까요? 단 10분 만에 실제 시스템을 만들 수 있는 설계도가 나왔습니다. 이제 AI에게 이 PRD대로 첫 화면 코드를 짜달라고 하면 끝납니다!")

    # ==========================================
    # SLIDE 12: 성공 꿀팁 (Do & Don't)
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "AI 협업 성공을 위한 꿀팁 (Do & Don't)", "PART 5. BEST PRACTICES")

    d_card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.7), Inches(4.8))
    d_card.fill.solid()
    d_card.fill.fore_color.rgb = COLOR_CARD
    d_card.line.color.rgb = COLOR_BORDER
    tf = d_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "⭕ 반드시 해야 할 것 (DO)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(14)
    dos = [
        "• '화면 1개, 버튼 1개'씩 벽돌 쌓듯이 대화하기",
        "• 눈에 보이는 UI(화면)부터 먼저 만들어 검증하기",
        "• 에러 나면 에러 메시지 통째로 복사해서 던지기",
        "• '왜 이렇게 짰는지 설명해줘' 물어보며 배우기"
    ]
    for d in dos:
        pi = tf.add_paragraph()
        pi.text = d
        pi.font.size = Pt(13)
        pi.font.color.rgb = COLOR_TEXT
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(10)

    dont_card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(4.8))
    dont_card.fill.solid()
    dont_card.fill.fore_color.rgb = COLOR_CARD
    dont_card.line.color.rgb = COLOR_BORDER
    tf = dont_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "❌ 절대 하지 말아야 할 것 (DON'T)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_ROSE
    p.font.name = "Malgun Gothic"
    p.space_after = Pt(14)
    donts = [
        "• 한 번에 모든 기능을 다 넣으려고 욕심부리기",
        "• DB 설치나 서버 인프라부터 고민하다 지치기",
        "• 에러 떴을 때 혼자 고민하다 포기하기",
        "• 기획 문서(PRD) 없이 바로 코딩부터 시작하기"
    ]
    for d in donts:
        pi = tf.add_paragraph()
        pi.text = d
        pi.font.size = Pt(13)
        pi.font.color.rgb = COLOR_TEXT
        pi.font.name = "Malgun Gothic"
        pi.space_after = Pt(10)

    add_speaker_notes(s12, "실제 만들어보실 때 마주칠 함정 3가지만 기억하세요. 첫째, 욕심내지 말고 벽돌 쌓기. 둘째, 에러 나면 에러 복붙해서 AI 던지기!")

    # ==========================================
    # SLIDE 13: 문서화와 팝업 매뉴얼
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "엔터프라이즈의 마침표: 문서화와 팝업 매뉴얼", "PART 5. GOVERNANCE")

    m_cards = [
        ("1. 사용자 & 관리자 매뉴얼", "MANUAL.md", "• 누가 봐도 1분 만에 이해하는 사용 가이드\n• 신입사원 모바일 포털 및 관리자 대시보드\n• 회차별 설문 및 IT 자산 관리 매뉴얼"),
        ("2. 시스템 재현 설계명세서", "SPECIFICATION.md", "• 데이터베이스 ERD 및 API 규격서\n• AI 위험 분석 알고리즘 수식 정의\n• 누구나 동일 시스템을 다시 만들 수 있는 청사진"),
        ("3. 대시보드 30초 팝업 가이드", "UserManualModal", "• 사이트 접속 즉시 30초 체험 팝업 자동 호출\n• 별도 교육 없이도 동료들이 즉시 사용\n• 언제든 다시 열어볼 수 있는 상시 매뉴얼 버튼")
    ]
    for i, (mt, mf, md) in enumerate(m_cards):
        cx = Inches(0.8 + i * 3.95)
        card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, Inches(1.9), Inches(3.7), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = mt
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY
        p1.font.name = "Malgun Gothic"

        p2 = tf.add_paragraph()
        p2.text = mf
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = COLOR_PRIMARY
        p2.font.name = "Courier New"
        p2.space_after = Pt(12)

        p3 = tf.add_paragraph()
        p3.text = md
        p3.font.size = Pt(11)
        p3.font.color.rgb = COLOR_TEXT
        p3.font.name = "Malgun Gothic"

    add_speaker_notes(s13, "혼자 쓰고 버리는 장난감과 진짜 사내 프로젝트의 차이는 문서화에 있습니다. 팀원들이 쓸 수 있도록 팝업 매뉴얼을 만드는 것이 프로덕트의 완성입니다.")

    # ==========================================
    # SLIDE 14: Q&A
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_header(s14, "자주 묻는 질문 (FAQ) & 자유 Q&A", "PART 5. Q&A")

    faqs = [
        ("Q1. 사내 보안 규정상 외부 클라우드(DB/Vercel) 써도 되나요?", "➔ 프로토타입 검증 단계에서는 더미(가상) 데이터로 무료 클라우드를 활용하고, 전사 도입 시 사내 On-Premise 서버나 전용 사내망으로 이전할 수 있습니다."),
        ("Q2. 우리 회사 내부망 ERP나 그룹웨어와도 실제로 붙일 수 있나요?", "➔ 네! REST API나 사내 DB View/Stored Procedure 연계로 100% 연동 가능합니다. (HR Sync에 실제 연동 엔드포인트 설계 완료)"),
        ("Q3. 제가 코드를 하나도 모르는데 유지보수를 어떻게 하나요?", "➔ 코드를 직접 고칠 필요 없이, AI에게 '이 부분 글자 크기 키워줘', '필터 추가해줘'라고 말하고 복사-붙여넣기만 하면 됩니다.")
    ]
    for i, (q, a) in enumerate(faqs):
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9 + i * 1.6), Inches(11.7), Inches(1.4))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = COLOR_BORDER
        tf = card.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = q
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_PRIMARY
        p1.font.name = "Malgun Gothic"
        p1.space_after = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = a
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT
        p2.font.name = "Malgun Gothic"

    add_speaker_notes(s14, "지금까지 80분 동안 전과정을 살펴보셨습니다. 평소 궁금하셨던 점이나 내 업무에 적용할 때 고민되는 점 편하게 질문해주세요!")

    # ==========================================
    # SLIDE 15: 엔딩
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15)

    end_box = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.2), Inches(10.9), Inches(5.1))
    end_box.fill.solid()
    end_box.fill.fore_color.rgb = COLOR_CARD
    end_box.line.color.rgb = COLOR_BORDER
    end_box.line.width = Pt(1.5)

    etf = end_box.text_frame
    etf.word_wrap = True

    p0 = etf.paragraphs[0]
    p0.text = "WORKSHOP CLOSING"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PRIMARY
    p0.font.name = "Malgun Gothic"
    p0.space_after = Pt(16)

    p1 = etf.add_paragraph()
    p1.text = "\"가장 훌륭한 시스템은,\n현업에서 매일 고통받는 당신의 머릿속에 있습니다.\""
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_NAVY
    p1.font.name = "Malgun Gothic"
    p1.space_after = Pt(20)

    p2 = etf.add_paragraph()
    p2.text = "오늘 작성하신 1장의 기획서로 오늘 퇴근 전 AI에게 첫 화면을 요청해보세요!\n다음 주 월요일, 우리 팀의 일하는 방식이 완전히 달라질 것입니다."
    p2.font.size = Pt(14)
    p2.font.color.rgb = COLOR_MUTED
    p2.font.name = "Malgun Gothic"
    p2.space_after = Pt(26)

    p3 = etf.add_paragraph()
    p3.text = "🌐 라이브 사이트: https://hr-sync-delta.vercel.app  |  🐙 깃허브: https://github.com/kimyeasll-byte/hr-sync"
    p3.font.size = Pt(12)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_PRIMARY
    p3.font.name = "Malgun Gothic"

    add_speaker_notes(s15, "오늘 워크숍의 마지막 메시지입니다. 가장 훌륭한 아이디어는 현업의 여러분 고민에서 출발합니다. 오늘 뽑아내신 그 1장의 PRD로 오늘 퇴근 전에 AI에게 '첫 화면 만들어줘'라고 한마디만 던져보세요. 경청해주셔서 감사합니다!")

    # Output paths
    output_path = "AI_Web_Service_Workshop.pptx"
    public_path = os.path.join("public", "AI_Web_Service_Workshop.pptx")
    prs.save(output_path)
    prs.save(public_path)
    print(f"Presentation saved to: {output_path} and {public_path}")

if __name__ == "__main__":
    create_deck()
