# Production Readiness & Deployment Checklist (พร้อมใช้งานจริง)

## 📌 ภาพรวมระบบ (System Overview)
ระบบเว็บไซต์และระบบจัดการหลังบ้าน **AIS 3BB FIBRE 3 by บริษัท โฮมไฟเบอร์เนต999 จำกัด** ได้รับการตรวจสอบ ปรับปรุง และเตรียมความพร้อมสำหรับการนำขึ้นใช้งานจริงบนโดเมนหลัก (Production Environment)

---

## 1. การจัดการข้อมูลและการล้างข้อมูลตัวอย่าง (Clean Data & Empty States)
- [x] **ลบ Mock/Sample Leads ทั้งหมด**: เคลียร์รายการคำขอทดสอบทั้งหมดให้เริ่มต้นจากสถานะว่าง (`[]`) 
- [x] **ลบ Mock Applications ทั้งหมด**: เคลียร์รายการใบสมัครทดสอบทั้งหมด
- [x] **ลบการแจ้งเตือนจำลอง**: เคลียร์การแจ้งเตือนจำลองออกทั้งหมด
- [x] **Empty States ครบทุกหน้า**: 
  - หน้าตาราง CRM Leads / Applications แสดง Empty State พร้อมข้อความแนะนำอย่างชัดเจน
  - หน้า Reports & Analytics คำนวณสถิติตามข้อมูลจริง 100% (คำนวณอัตราปิดการขาย, MRR, Funnel จากเคสจริง)
  - หน้าตรวจสอบสถานะคำขอ (`TrackApplicationPage`) รองรับการค้นหาจริง พร้อมคำแนะนำรูปแบบรหัสที่ถูกต้อง (ไม่มีชิปรหัสทดสอบค้างอยู่)

---

## 2. ความปลอดภัยและการเข้าถึงระบบหลังบ้าน (Security & Admin Protection)
- [x] **การเข้าถึงระบบแบบ 5-Click Trigger**: ต้องคลิกต่อเนื่อง 5 ครั้งที่จุดเปิดระบบเพื่อป้องกันการเข้าถึงโดยไม่ได้ตั้งใจ
- [x] **Admin Security PIN**: 
  - มีระบบใส่รหัส PIN ก่อนเข้าถึงหน้าจัดการหลังบ้าน
  - สามารถเปลี่ยนรหัส PIN ได้จากระบบตั้งค่า และมีการบันทึกสถานะอย่างปลอดภัย
- [x] **ระบบ Lock Screen / Logout**: สามารถล็อคหน้าจอหลังบ้านได้ทันที
- [x] **ไม่มี Plain Text Secrets / API Keys ใน Frontend**: การเชื่อมต่อเป็นไปตามมาตรฐานความปลอดภัย

---

## 3. ข้อมูลองค์กรและการติดต่อ (Official Contact & Identity)
- [x] **ชื่อตัวแทนอย่างเป็นทางการ**: บริษัท โฮมไฟเบอร์เนต999 จำกัด
- [x] **เบอร์โทรศัพท์หลัก**: 062-193-9199, 098-976-8244
- [x] **LINE Official Account**: `@397cbhts` (ลิงก์ตรง: `https://line.me/ti/p/@397cbhts`)
- [x] **Facebook Page**: `https://facebook.com/aisfibrenet999`
- [x] **Dealer Code**: `DLR-999-NET`
- [x] **ที่อยู่สำนักงาน**: 512 หมู่ 1 ถนนรักสงบ ตำบลวิศิษฐ์ อำเภอเมือง จังหวัดบึงกาฬ 38000
- [x] **วิดีโอแนะนำอย่างเป็นทางการ**: YouTube Embed จากช่องทางการ

---

## 4. UI/UX และ Responsive Design
- [x] **Typography & Hierarchy**: 
  - ฟอนต์ภาษาไทย `Sarabun` (ทางการ อ่านง่าย คมชัด) และ `Prompt` ผสาน `Plus Jakarta Sans` สำหรับตัวเลขความเร็ว
  - หัวข้อหลัก `h1` และ Tab Bar ใช้โทนสี Gradient พรีเมียมสม่ำเสมอทุกหน้า (`emerald-400` -> `lime-400` -> `orange-500`)
- [x] **Responsive รองรับทุกอุปกรณ์**: 
  - Mobile (320px - 480px)
  - Tablet (768px - 1024px)
  - Desktop (1280px+)
- [x] **Touch Targets**: ปุ่มกดและฟอร์มกรอกข้อมูลมีขนาดมาตรฐาน 44px+ รองรับการสัมผัสบนมือถือ

---

## 5. ประสิทธิภาพและ SEO (Performance & SEO)
- [x] **HTML Meta Tags**: กำหนด `<title>`, `<meta description>`, OpenGraph Tags ครบถ้วน
- [x] **Favicon & Brand Icon**: ตั้งค่าโลโก้ AIS FIBRE 3 ชัดเจน
- [x] **Asset Optimization**: โหลดฟอนต์ผ่าน Google Fonts Preconnect

---

## 6. คำแนะนำสำหรับการผูก Custom Domain
1. **ตั้งค่า DNS Records**:
   - เพิ่ม `A` Record หรือ `CNAME` ชี้ไปยังโฮสต์ที่ให้บริการ
2. **เปิดใช้งาน SSL/HTTPS**:
   - ตรวจสอบให้แน่ใจว่าได้เปิดใช้งาน HTTPS อัตโนมัติ (Let's Encrypt / Cloudflare SSL)
3. **ตรวจสอบการทำงานของ Webhook / LINE Notify**:
   - หากมีการใช้งาน LINE Notify หรือ Webhook แจ้งเตือน ให้ตรวจสอบ Token ในการตั้งค่าหลังบ้าน
