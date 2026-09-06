import { AboutUsSettings, ActivityImage } from '../types';

// High-fidelity vector representations of the official AWN / AIS Fibre 3 Dealer Authorization Documents
// These serve as crisp default A4 documents matching the official certificates.
// The admin backend allows uploading/replacing both A4 images with any JPG/PNG file anytime.

export const DEFAULT_CERTIFICATE_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" width="100%" height="100%">
  <defs>
    <linearGradient id="awnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8CC63F" />
      <stop offset="100%" stopColor="#4A9B23" />
    </linearGradient>
  </defs>

  <!-- Clean White A4 Canvas -->
  <rect width="595" height="842" fill="#FFFFFF" />
  
  <!-- Header: AWN Logo -->
  <g transform="translate(430, 32)">
    <path d="M 8 16 C 26 4, 52 12, 62 26 C 48 20, 32 18, 18 24 Z" fill="url(#awnGrad)" />
    <path d="M 16 19 C 30 14, 46 17, 54 25 C 42 22, 28 20, 18 24 Z" fill="#B5E838" />
    <text x="70" y="32" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="22" font-weight="900" fill="#2E7D32">AWN</text>
  </g>

  <!-- Date -->
  <text x="420" y="96" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" fill="#333333">วันที่ 28 สิงหาคม 2567</text>

  <!-- Document Header -->
  <g transform="translate(48, 132)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" fill="#111827">
    <text x="0" y="0" font-weight="bold">เรื่อง</text>
    <text x="40" y="0">ขออนุญาตโฆษณาประชาสัมพันธ์โดยใช้เครื่องหมายการค้าของบริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด</text>
    <text x="40" y="16">ตามสัญญาจ้าง งานช่องทางจำหน่ายและให้บริการ</text>

    <text x="0" y="44" font-weight="bold">เรียน</text>
    <text x="40" y="44">กรรมการผู้จัดการ</text>
    <text x="40" y="60">บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด</text>

    <!-- Content Paragraphs -->
    <text x="35" y="92">ตามที่ บริษัท โฮมไฟเบอร์เนต999 จำกัด ("ผู้รับจ้าง") ได้เข้าทำสัญญาจ้าง งานช่องทาง</text>
    <text x="0" y="108">จำหน่ายและให้บริการ กับบริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด ("ผู้ว่าจ้าง/AWN") โดยเป็นผู้มีสิทธิจำหน่าย</text>
    <text x="0" y="124">และให้บริการของ AWN ตามที่ระบุในสัญญา เพื่อให้การดำเนินการเป็นไปตามวัตถุประสงค์ของสัญญาดังกล่าว</text>
    <text x="0" y="140">ผู้รับจ้างจึงเรียนมาเพื่อขออนุญาตใช้ Website ของผู้รับจ้างที่มีรายชื่อตามตารางด้านล่างนี้ สามารถใช้เครื่องหมาย</text>
    <text x="0" y="156">การค้า AIS Fibre, AIS Fibre3, AIS 3BB Fibre3 ของ AWN ตามข้อ 16 ของสัญญาจ้าง เพื่อโฆษณาประชาสัมพันธ์</text>
    <text x="0" y="172">สินค้าและ/หรือบริการของ AWN โดยเนื้อหาข้อความสื่อประชาสัมพันธ์เป็นไปตามที่ AWN กำหนด หรือสื่อ</text>
    <text x="0" y="188">ประชาสัมพันธ์ที่ผู้รับจ้างเป็นผู้จัดทำ รวมถึงลงใช้รูปแบบสื่อประชาสัมพันธ์ของ AWN โดยได้รับการอนุมัติจาก</text>
    <text x="0" y="204">หน่วยงานซึ่งมีหน้าที่รับผิดชอบของ AWN เรียบร้อยแล้ว</text>
  </g>

  <!-- Table: Authorized Websites -->
  <g transform="translate(52, 362)">
    <text x="0" y="-8" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" font-weight="bold" fill="#111827">รายชื่อ Website</text>
    
    <!-- Table Header -->
    <rect x="0" y="0" width="490" height="24" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
    <line x1="65" y1="0" x2="65" y2="24" stroke="#CBD5E1" />
    <text x="24" y="16" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" font-weight="bold" fill="#334155">No.</text>
    <text x="210" y="16" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" font-weight="bold" fill="#334155">Website (Domain name)</text>

    <!-- Row 1 -->
    <rect x="0" y="24" width="490" height="26" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" />
    <line x1="65" y1="24" x2="65" y2="50" stroke="#CBD5E1" />
    <text x="28" y="41" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" fill="#111827">1</text>
    <text x="80" y="41" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="11" fill="#1D4ED8" font-weight="500">https://www.aisfibre4u.com</text>
  </g>

  <!-- Notes & Closing -->
  <g transform="translate(48, 442)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="10.5" fill="#111827">
    <text x="35" y="0">ทั้งนี้ หากผู้รับจ้างประสงค์จะเปลี่ยนแปลงแก้ไข และหรือเพิ่มเติมรายชื่อ Website ที่ใช้ในการดำเนินการ</text>
    <text x="0" y="16">ตามสัญญาจ้างดังกล่าว ผู้รับจ้างจะดำเนินการขออนุญาตผู้ว่าจ้างล่วงหน้าเพื่อให้ได้รับอนุญาตก่อนนำไปใช้ทุก</text>
    <text x="0" y="32">คราวไป</text>

    <text x="35" y="66">จึงเรียนมาเพื่อโปรดพิจารณาอนุญาต</text>
  </g>

  <!-- Signatures Block 1 (Applicant) -->
  <g transform="translate(350, 542)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="10.5" fill="#111827" text-anchor="middle">
    <text x="0" y="0">ขอแสดงความนับถือ</text>
    
    <!-- Signature Curve -->
    <path d="M -50 35 Q -30 10, -10 38 Q 10 15, 30 35 Q 50 20, 60 36" fill="none" stroke="#1E3A8A" stroke-width="1.8" />
    
    <text x="0" y="48">ลงชื่อ............................................................</text>
    <text x="0" y="66">( เกรียงสิทธิ์ ตั้งขนานุสนธิ์ )</text>
    <text x="0" y="82" font-size="9.5" fill="#4B5563">บริษัท โฮมไฟเบอร์เนต999 จำกัด</text>
  </g>

  <!-- Divider Line -->
  <line x1="48" y1="655" x2="545" y2="655" stroke="#94A3B8" stroke-dasharray="2 2" />

  <!-- Approval Footer by AWN -->
  <g transform="translate(48, 676)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="9.5" fill="#1F2937">
    <text x="35" y="0">ข้าพเจ้าบริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด โดย นายธนิตย์ ชัยยะบุญยนิสต์ ผู้รับมอบอำนาจ ตกลง</text>
    <text x="0" y="14">อนุญาตให้ ผู้รับจ้างใช้เครื่องหมายการค้า AIS Fibre, AIS Fibre3, AIS 3BB Fibre3 เพื่อวัตถุประสงค์ในการ</text>
    <text x="0" y="28">ดำเนินการตามสัญญาจ้าง งานช่องทางจำหน่ายและให้บริการ จนกว่าจะสิ้นสุดสัญญา ตามรายละเอียดที่กำหนดไว้</text>
    <text x="0" y="42">ข้างต้น</text>
  </g>

  <!-- AWN Authority Signature -->
  <g transform="translate(400, 755)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="9.5" fill="#111827" text-anchor="middle">
    <path d="M -60 22 C -40 0, -20 30, 0 10 C 20 25, 40 5, 55 24" fill="none" stroke="#0047AB" stroke-width="2" />
    <text x="0" y="32">ลงชื่อ............................................................</text>
    <text x="0" y="46" font-weight="bold">(นายธนิตย์ ชัยยะบุญยนิสต์)</text>
    <text x="0" y="58" font-size="8.5" fill="#64748B">ผู้มีอำนาจลงนาม / AWN</text>
  </g>
</svg>
`)}`;

export const DEFAULT_CERTIFICATE_2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" width="100%" height="100%">
  <defs>
    <linearGradient id="awnGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8CC63F" />
      <stop offset="100%" stopColor="#4A9B23" />
    </linearGradient>
  </defs>

  <!-- Clean White A4 Canvas -->
  <rect width="595" height="842" fill="#FFFFFF" />

  <!-- Top Reference Code -->
  <text x="48" y="52" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="9.5" font-weight="bold" fill="#1E293B">AIS Fibre Partner Letter 0008/2025</text>

  <!-- AWN Logo -->
  <g transform="translate(430, 32)">
    <path d="M 8 16 C 26 4, 52 12, 62 26 C 48 20, 32 18, 18 24 Z" fill="url(#awnGrad2)" />
    <path d="M 16 19 C 30 14, 46 17, 54 25 C 42 22, 28 20, 18 24 Z" fill="#B5E838" />
    <text x="70" y="32" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="22" font-weight="900" fill="#2E7D32">AWN</text>
  </g>

  <!-- Title Heading -->
  <g transform="translate(48, 115)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" fill="#0F172A">
    <text x="250" y="0" font-size="13" font-weight="bold" text-anchor="middle">
      หนังสือแสดงการเป็นตัวแทนจำหน่ายและให้บริการอินเทอร์เน็ตบ้าน AIS 3BB FIBRE3
    </text>

    <!-- Company Details -->
    <text x="20" y="44" font-size="10.5" font-weight="bold">บริษัท โฮมไฟเบอร์เนต999 จำกัด</text>
    <text x="220" y="44" font-size="9.5">ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ต.วิศิษฐ์ อ.เมือง จ.บึงกาฬ 38000</text>
    
    <text x="0" y="74" font-size="10.5">เป็นตัวแทนจำหน่ายและให้บริการอินเทอร์เน็ตบ้าน AIS 3BB FIBRE3 ภายใต้การดำเนินการของ</text>
    <text x="0" y="100" font-size="10.5" font-weight="bold">บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด (AWN)</text>
    <text x="0" y="126" font-size="10.5">โดยมีรายละเอียดดังนี้</text>
  </g>

  <!-- Key Info Table / Specifications -->
  <g transform="translate(48, 275)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="10.5" fill="#1E293B">
    <!-- Row 1: ประเภทตัวแทน -->
    <text x="0" y="0" font-weight="bold">ประเภทตัวแทน</text>
    <text x="140" y="0">:  Fixed Broadband Dealer</text>

    <!-- Row 2: รหัสตัวแทน -->
    <text x="0" y="32" font-weight="bold">รหัสตัวแทน</text>
    <text x="140" y="32" font-weight="bold" fill="#047857">:  8800010 / 8800011 / 1004784</text>
    <text x="325" y="32" font-size="9.5" fill="#475569">บริษัท โฮมไฟเบอร์เนต999 จำกัด</text>

    <!-- Row 3: ช่องทางจำหน่าย -->
    <text x="0" y="64" font-weight="bold">ช่องทางจำหน่าย</text>
    <text x="140" y="64" fill="#1D4ED8" font-weight="500">:  www.aisfibre4u.com</text>

    <!-- Row 4: เขตพื้นที่ -->
    <text x="0" y="118" font-weight="bold">เขตพื้นที่ จำหน่ายและให้บริการ</text>
    <text x="150" y="118">:  พื้นที่ บางเขน ลาดพร้าว หลักสี่ คันนายาว บางกะปิ สะพานสูง วังทองหลาง บึงกุ่ม</text>
    <text x="158" y="138">ประเวศ สวนหลวง พระโขนง บางนา</text>

    <!-- Row 5: วันแต่งตั้ง -->
    <text x="0" y="180" font-weight="bold">วันแต่งตั้ง</text>
    <text x="140" y="180">:  01/07/2023</text>

    <!-- Row 6: วันหมดอายุ -->
    <text x="0" y="212" font-weight="bold">วันหมดอายุ</text>
    <text x="140" y="212">:  31/12/2025</text>

    <!-- Row 7: ออกให้ ณ วันที่ -->
    <text x="0" y="244" font-weight="bold">หนังสือฉบับนี้ออกให้ ณ วันที่</text>
    <text x="155" y="244">:  29/05/2025</text>
  </g>

  <!-- Authorized Signatory & Official Stamp -->
  <g transform="translate(390, 640)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" text-anchor="middle">
    <!-- Blue Signature -->
    <path d="M -60 20 C -40 -5, -20 35, 0 10 C 20 28, 45 5, 60 25" fill="none" stroke="#0047AB" stroke-width="2.5" />

    <text x="0" y="40" font-size="11" font-weight="bold" fill="#0F172A">นาย ธนิตย์ ชัยยะบุญยนิสต์</text>
    <text x="0" y="56" font-size="9.5" font-weight="500" fill="#334155">Head of Technology Department - Broadband Business</text>
    <text x="0" y="72" font-size="9.5" font-weight="bold" fill="#1E293B">บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด</text>
  </g>

  <!-- Official AWN Footer Info -->
  <g transform="translate(425, 755)" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="7.5" fill="#64748B" text-anchor="start">
    <text x="0" y="0" font-weight="bold" fill="#D97706">Advanced Wireless Network</text>
    <text x="40" y="10">Company Limited</text>
    <text x="25" y="20">414 Phaholyothin Rd.,</text>
    <text x="25" y="30">Samsen Nai, Phayathai,</text>
    <text x="35" y="40">Bangkok 10400</text>
    <text x="30" y="50">Tel : (66) 2-029-5000</text>
    <text x="26" y="60">Website : www.ais.co.th</text>
  </g>

  <!-- Footer Watermark Note -->
  <text x="48" y="805" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif" font-size="8" fill="#94A3B8">
    สำหรับใช้เผยแพร่บนเว็บไซต์ของ www.aisfibre4u.com ของ บริษัท โฮมไฟเบอร์เนต999 จำกัด เท่านั้น
  </text>
</svg>
`)}`;

export const BLANK_CERTIFICATE_1 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" width="100%" height="100%">
  <!-- Clean Blank A4 Canvas -->
  <rect width="595" height="842" fill="#FAFAFA" />
  <rect x="24" y="24" width="547" height="794" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 8" />
  
  <g transform="translate(297, 400)" text-anchor="middle" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif">
    <!-- Subtle Document Icon -->
    <rect x="-36" y="-55" width="72" height="96" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
    <path d="M 6 -55 L 36 -25 L 36 -55 Z" fill="#E2E8F0" />
    <line x1="-20" y1="-18" x2="12" y2="-18" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="-2" x2="20" y2="-2" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="14" x2="20" y2="14" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="30" x2="4" y2="30" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Placeholder Label -->
    <text y="80" font-size="18" font-weight="bold" fill="#64748B">รูปภาพใบอนุญาต ฉบับที่ 1</text>
    <text y="106" font-size="13" fill="#94A3B8">(พื้นที่สำหรับแสดงเอกสารใบอนุญาตตัวแทน A4)</text>
  </g>
</svg>
`)}`;

export const BLANK_CERTIFICATE_2 = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" width="100%" height="100%">
  <!-- Clean Blank A4 Canvas -->
  <rect width="595" height="842" fill="#FAFAFA" />
  <rect x="24" y="24" width="547" height="794" rx="8" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8 8" />
  
  <g transform="translate(297, 400)" text-anchor="middle" font-family="'Sarabun', 'Segoe UI', Tahoma, sans-serif">
    <!-- Subtle Document Icon -->
    <rect x="-36" y="-55" width="72" height="96" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2" />
    <path d="M 6 -55 L 36 -25 L 36 -55 Z" fill="#E2E8F0" />
    <line x1="-20" y1="-18" x2="12" y2="-18" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="-2" x2="20" y2="-2" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="14" x2="20" y2="14" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    <line x1="-20" y1="30" x2="4" y2="30" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
    
    <!-- Placeholder Label -->
    <text y="80" font-size="18" font-weight="bold" fill="#64748B">รูปภาพใบอนุญาต ฉบับที่ 2</text>
    <text y="106" font-size="13" fill="#94A3B8">(พื้นที่สำหรับแสดงเอกสารตัวแทนจำหน่าย Partner Letter)</text>
  </g>
</svg>
`)}`;

export const DEFAULT_ACTIVITY_IMAGES: ActivityImage[] = [
  {
    id: 'act-1',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80',
    title: 'ทีมงานวิศวกรเข้าติดตั้งสายไฟเบอร์ออปติกตามมาตรฐาน AIS FIBRE 3',
    description: 'เดินสายสัญญาณ Optical Fiber สปีดเต็มพิกัด พร้อมวัดค่าแสง (Optical Power) ตรวจสอบความเสถียร 100%',
  },
  {
    id: 'act-2',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    title: 'ติดตั้งเราเตอร์ Wi-Fi 6 และทดสอบความเร็วอินเทอร์เน็ตหน้างาน',
    description: 'ทดสอบ Speed Test จริงทุกจุด และจัดวางตำแหน่งกระจายสัญญาณให้ครอบคลุมทั่วทุกห้องในบ้าน',
  },
  {
    id: 'act-3',
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&q=80',
    title: 'บริการรับสมัครและให้คำปรึกษาแพ็กเกจเน็ตบ้านด้วยความจริงใจ',
    description: 'แอดมินฝ่ายขาย โฮมไฟเบอร์เนต999 ให้บริการเช็กพื้นที่รวดเร็ว แนะนำโปรโมชั่นที่คุ้มค่าที่สุด',
  },
  {
    id: 'act-4',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    title: 'กิจกรรมส่งมอบบริการและดูแลลูกค้าในพื้นที่อย่างใกล้ชิด',
    description: 'พร้อมบริการหลังการขาย ดูแลใส่ใจตลอดอายุการใช้งานโดยทีมงานตัวแทนจำหน่ายอย่างเป็นทางการ',
  },
];

export const INITIAL_ABOUT_SETTINGS: AboutUsSettings = {
  title_part1: 'ใบอนุญาตตัวแทนจำหน่าย',
  title_part2: 'อย่างเป็นทางการ',
  company_name: 'บริษัท โฮมไฟเบอร์เนต999 จำกัด',
  company_address: 'ที่ตั้ง บริษัท 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000',
  doc1_title: 'หนังสือขออนุญาตใช้เครื่องหมายการค้าและประชาสัมพันธ์ AWN',
  doc1_image: BLANK_CERTIFICATE_1,
  doc2_title: 'หนังสือแสดงการเป็นตัวแทนจำหน่าย AIS 3BB FIBRE3 (Partner Letter)',
  doc2_image: BLANK_CERTIFICATE_2,
  dealer_codes: ['8800010', '8800011', '1004784'],
  authorized_by: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด (AWN)',
  show_certificates: true,
  show_activities: true,
  activity_images: DEFAULT_ACTIVITY_IMAGES,
  updated_at: new Date().toISOString(),
};
