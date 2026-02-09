import { User, UserRole, Note, PDFResource, ChatMessage } from './types';

// Helper to generate consistent avatar
const getAvatar = (id: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;

// Departments: YE (Yarn), FE (Fabric), AE (Apparel), WPE (Wet Process)
// Batch mapping assumption: 23xxxx -> 15th Batch, 22xxxx -> 14th Batch

export const MOCK_USERS: User[] = [
  // --- YE (Yarn Engineering) - 230401... ---
  { id: '23040101001', rollNumber: '23040101001', fullName: 'MD. ARAFAT SARDAR', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 2.72, profileImageUrl: getAvatar('23040101001') },
  { id: '23040101002', rollNumber: '23040101002', fullName: 'HASIBUL ISLAM MAHID', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.25, profileImageUrl: getAvatar('23040101002') },
  { id: '23040101003', rollNumber: '23040101003', fullName: 'HOSAIN BILLAH', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 3.11, failedSubjects: ['FME'], profileImageUrl: getAvatar('23040101003') },
  { id: '23040101004', rollNumber: '23040101004', fullName: 'MD. MAZHARUL ISLAM', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.08, profileImageUrl: getAvatar('23040101004') },
  { id: '23040101005', rollNumber: '23040101005', fullName: 'MD. MIRAJUL ISLAM MOLLA', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 75, cgpa: 2.82, failedSubjects: ['CP'], profileImageUrl: getAvatar('23040101005') },
  { id: '23040101006', rollNumber: '23040101006', fullName: 'MD. SAKIB HOWLADER', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 90, cgpa: 3.57, profileImageUrl: getAvatar('23040101006') },
  { id: '23040101007', rollNumber: '23040101007', fullName: 'MD. KABIR HOSSEN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 79, cgpa: 2.84, profileImageUrl: getAvatar('23040101007') },
  { id: '23040101008', rollNumber: '23040101008', fullName: 'MD. MEHEDI HASAN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 77, cgpa: 2.98, profileImageUrl: getAvatar('23040101008') },
  { id: '23040101010', rollNumber: '23040101010', fullName: 'AL-AMIN HOSSAIN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 76, cgpa: 2.84, failedSubjects: ['EM', 'SSS-I'], profileImageUrl: getAvatar('23040101010') },
  { id: '23040101011', rollNumber: '23040101011', fullName: 'MD NAFIZ IMTIAZ', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.04, failedSubjects: ['SSS-I'], profileImageUrl: getAvatar('23040101011') },
  { id: '23040101012', rollNumber: '23040101012', fullName: 'MD. ROKONUZZAMAN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 74, cgpa: 2.79, failedSubjects: ['Chem-II', 'EM', 'SSS-I'], profileImageUrl: getAvatar('23040101012') },
  { id: '23040101014', rollNumber: '23040101014', fullName: 'MD. SHOUROV HOSSEN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 88, cgpa: 3.18, failedSubjects: ['SSS-I'], profileImageUrl: getAvatar('23040101014') },
  { id: '23040101015', rollNumber: '23040101015', fullName: 'MD. NAIM ALI', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.09, profileImageUrl: getAvatar('23040101015') },
  { id: '23040101016', rollNumber: '23040101016', fullName: 'MD. ABUL IHSAN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 75, cgpa: 2.93, failedSubjects: ['Math-II', 'EM', 'SSS-I', 'FM-I', 'FME'], profileImageUrl: getAvatar('23040101016') },
  { id: '23040101017', rollNumber: '23040101017', fullName: 'SHAHED RAHMAN SHAD', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.CR, attendancePercent: 89, cgpa: 3.54, profileImageUrl: getAvatar('23040101017') },
  { id: '23040101018', rollNumber: '23040101018', fullName: 'MD. JULHAS UDDIN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 3.14, failedSubjects: ['FME'], profileImageUrl: getAvatar('23040101018') },
  { id: '23040101019', rollNumber: '23040101019', fullName: 'MD. SUJON PRODHAN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 73, cgpa: 2.83, failedSubjects: ['FME'], profileImageUrl: getAvatar('23040101019') },
  { id: '23040101020', rollNumber: '23040101020', fullName: 'MUNSHI RIFAT HASAN', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 87, cgpa: 3.26, profileImageUrl: getAvatar('23040101020') },
  { id: '23040101021', rollNumber: '23040101021', fullName: 'RABBI MOLLAH', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 74, cgpa: 2.77, failedSubjects: ['Math-I', 'EM', 'SSS-I', 'FME'], profileImageUrl: getAvatar('23040101021') },
  { id: '23040101023', rollNumber: '23040101023', fullName: 'MD. REMON GAZI', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 86, cgpa: 3.36, profileImageUrl: getAvatar('23040101023') },
  { id: '23040101024', rollNumber: '23040101024', fullName: 'TAZRIAN AHMED', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 76, cgpa: 2.86, failedSubjects: ['Math-II', 'EM', 'SSS-I'], profileImageUrl: getAvatar('23040101024') },
  { id: '23040101025', rollNumber: '23040101025', fullName: 'MD. SHUVO CHOWDHURY', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.99, failedSubjects: ['EM'], profileImageUrl: getAvatar('23040101025') },
  { id: '23040101026', rollNumber: '23040101026', fullName: 'MOHAMMAD TAFSIN AHMED', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.07, failedSubjects: ['SSS-I'], profileImageUrl: getAvatar('23040101026') },
  { id: '23040101027', rollNumber: '23040101027', fullName: 'MD. ARAFAT MAHAMUD ARIF', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 72, cgpa: 2.81, failedSubjects: ['EM', 'SSS-I', 'FME', 'STAT'], profileImageUrl: getAvatar('23040101027') },
  { id: '23040101028', rollNumber: '23040101028', fullName: 'MD. SHA AMIN REZA', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 74, cgpa: 2.80, failedSubjects: ['FME'], profileImageUrl: getAvatar('23040101028') },
  { id: '23040101029', rollNumber: '23040101029', fullName: 'BO SAIWANG MARMA', department: 'YE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 71, cgpa: 2.71, failedSubjects: ['Chem-II'], profileImageUrl: getAvatar('23040101029') },
  { id: '22040101009', rollNumber: '22040101009', fullName: 'MD. SHOHIDUL HASSAN ARIF', department: 'YE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.03, failedSubjects: ['SSS-I', 'FM-I'], profileImageUrl: getAvatar('22040101009') },
  { id: '22040101020', rollNumber: '22040101020', fullName: 'MD. JUBAIR HOSSAIN', department: 'YE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.09, failedSubjects: ['SSS-I'], profileImageUrl: getAvatar('22040101020') },

  // --- FE (Fabric Engineering) - 230402... ---
  { id: '23040201001', rollNumber: '23040201001', fullName: 'RIYAD HASAN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.CR, attendancePercent: 78, cgpa: 2.92, failedSubjects: ['YM-I', 'Wvg.PP', 'FME'], profileImageUrl: getAvatar('23040201001') },
  { id: '23040201002', rollNumber: '23040201002', fullName: 'AFIF AL TAMIM', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 88, cgpa: 3.37, profileImageUrl: getAvatar('23040201002') },
  { id: '23040201003', rollNumber: '23040201003', fullName: 'SHIGUFTAH JAHAN NAILA', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.02, profileImageUrl: getAvatar('23040201003') },
  { id: '23040201004', rollNumber: '23040201004', fullName: 'MALIHA BINTE ALOM', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 79, cgpa: 2.88, profileImageUrl: getAvatar('23040201004') },
  { id: '23040201005', rollNumber: '23040201005', fullName: 'S.M. YEASIN MANIK', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 68, cgpa: 2.61, failedSubjects: ['BCE', 'EM', 'YM-I', 'Wvg.PP', 'FME'], profileImageUrl: getAvatar('23040201005') },
  { id: '23040201006', rollNumber: '23040201006', fullName: 'ATIQUR RAHMAN SABBIR', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 86, cgpa: 3.35, profileImageUrl: getAvatar('23040201006') },
  { id: '23040201007', rollNumber: '23040201007', fullName: 'AYON SARKAR', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.15, profileImageUrl: getAvatar('23040201007') },
  { id: '23040201009', rollNumber: '23040201009', fullName: 'AMRIN ISLAM ETIKA', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 89, cgpa: 3.48, profileImageUrl: getAvatar('23040201009') },
  { id: '23040201010', rollNumber: '23040201010', fullName: 'AHASAN ISLAM EMON', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.09, profileImageUrl: getAvatar('23040201010') },
  { id: '23040201011', rollNumber: '23040201011', fullName: 'K M SAQIBUZZAMAN NABIL', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.19, profileImageUrl: getAvatar('23040201011') },
  { id: '23040201012', rollNumber: '23040201012', fullName: 'SAMIM AHSAN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 3.06, profileImageUrl: getAvatar('23040201012') },
  { id: '23040201013', rollNumber: '23040201013', fullName: 'MD. BELLAL HOSSEN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 90, cgpa: 3.52, profileImageUrl: getAvatar('23040201013') },
  { id: '23040201015', rollNumber: '23040201015', fullName: 'MD. AL-AMIN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 72, cgpa: 2.72, failedSubjects: ['EM', 'FME'], profileImageUrl: getAvatar('23040201015') },
  { id: '23040201016', rollNumber: '23040201016', fullName: 'MAHATIR MOHAMMAD', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 76, cgpa: 2.89, failedSubjects: ['EM', 'Wvg.PP', 'FME'], profileImageUrl: getAvatar('23040201016') },
  { id: '23040201019', rollNumber: '23040201019', fullName: 'TASKIN CHOWDHURY', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 68, cgpa: 2.64, failedSubjects: ['EM', 'CP', 'STAT', 'MMTF'], profileImageUrl: getAvatar('23040201019') },
  { id: '23040201020', rollNumber: '23040201020', fullName: 'MD. MASHIAT HASSAN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 67, cgpa: 2.61, failedSubjects: ['EM', 'YM-I', 'FME'], profileImageUrl: getAvatar('23040201020') },
  { id: '23040201021', rollNumber: '23040201021', fullName: 'NURE JANNAT ANIMA', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.16, profileImageUrl: getAvatar('23040201021') },
  { id: '23040201022', rollNumber: '23040201022', fullName: 'LAMIA HOQUE', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 86, cgpa: 3.32, profileImageUrl: getAvatar('23040201022') },
  { id: '23040201023', rollNumber: '23040201023', fullName: 'MD. IMRAN HOSSEN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.02, profileImageUrl: getAvatar('23040201023') },
  { id: '23040201024', rollNumber: '23040201024', fullName: 'MD. SHEIKH FARID', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 3.01, profileImageUrl: getAvatar('23040201024') },
  { id: '23040201025', rollNumber: '23040201025', fullName: 'NIBIR JAED JIM', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.92, profileImageUrl: getAvatar('23040201025') },
  { id: '23040201026', rollNumber: '23040201026', fullName: 'MD. ISRAK AHMMED FAYSAL', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.21, profileImageUrl: getAvatar('23040201026') },
  { id: '23040201028', rollNumber: '23040201028', fullName: 'SAYEEF MAHMUD AMEYO', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.07, profileImageUrl: getAvatar('23040201028') },
  { id: '23040201029', rollNumber: '23040201029', fullName: 'MD. IBRAHIM KHALIL SIKDER', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.95, failedSubjects: ['EM'], profileImageUrl: getAvatar('23040201029') },
  { id: '23040201031', rollNumber: '23040201031', fullName: 'MD. MOJIBOR RAHMAN', department: 'FE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 76, cgpa: 2.84, failedSubjects: ['FME'], profileImageUrl: getAvatar('23040201031') },
  { id: '22040201003', rollNumber: '22040201003', fullName: 'MD. RAJIB HOSSEN', department: 'FE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 3.00, failedSubjects: ['EM', 'Wvg.PP'], profileImageUrl: getAvatar('22040201003') },
  { id: '22040201006', rollNumber: '22040201006', fullName: 'HASIBUL HOSSAIN TANVIR', department: 'FE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 68, cgpa: 2.60, failedSubjects: ['EM', 'FME'], profileImageUrl: getAvatar('22040201006') },
  { id: '22040201025', rollNumber: '22040201025', fullName: 'MD. SAIFUL ISLAM NAYEEM', department: 'FE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 67, cgpa: 2.56, failedSubjects: ['Wvg.PP', 'FME'], profileImageUrl: getAvatar('22040201025') },

  // --- AE (Apparel Engineering) - 230404... ---
  { id: '23040401001', rollNumber: '23040401001', fullName: 'MASUMA AKTER', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 90, cgpa: 3.49, profileImageUrl: getAvatar('23040401001') },
  { id: '23040401002', rollNumber: '23040401002', fullName: 'MAHMUDA RAZIA SIDDIKA', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 92, cgpa: 3.56, profileImageUrl: getAvatar('23040401002') },
  { id: '23040401003', rollNumber: '23040401003', fullName: 'FARJANA', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.15, profileImageUrl: getAvatar('23040401003') },
  { id: '23040401004', rollNumber: '23040401004', fullName: 'NUSRAT LIA', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 95, cgpa: 3.82, profileImageUrl: getAvatar('23040401004') },
  { id: '23040401005', rollNumber: '23040401005', fullName: 'ALVI RAHMAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.34, profileImageUrl: getAvatar('23040401005') },
  { id: '23040401006', rollNumber: '23040401006', fullName: 'MD. SHAJID ABDULLAH', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.27, profileImageUrl: getAvatar('23040401006') },
  { id: '23040401007', rollNumber: '23040401007', fullName: 'SABJANA AKTER', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 87, cgpa: 3.44, profileImageUrl: getAvatar('23040401007') },
  { id: '23040401008', rollNumber: '23040401008', fullName: 'MD. JABERUL ISLAM RUDRO', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.95, failedSubjects: ['Phy-I'], profileImageUrl: getAvatar('23040401008') },
  { id: '23040401009', rollNumber: '23040401009', fullName: 'BASUDEB ROY ASIT', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 81, cgpa: 3.08, profileImageUrl: getAvatar('23040401009') },
  { id: '23040401010', rollNumber: '23040401010', fullName: 'MD. REJAUL HAQUE RONY', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.08, profileImageUrl: getAvatar('23040401010') },
  { id: '23040401011', rollNumber: '23040401011', fullName: 'HAFIZA AKTER ADETI', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 75, cgpa: 2.79, failedSubjects: ['Chem-II'], profileImageUrl: getAvatar('23040401011') },
  { id: '23040401012', rollNumber: '23040401012', fullName: 'LAMIA AKTER', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 89, cgpa: 3.43, profileImageUrl: getAvatar('23040401012') },
  { id: '23040401013', rollNumber: '23040401013', fullName: 'MD. NAYEM ISLAM', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.30, profileImageUrl: getAvatar('23040401013') },
  { id: '23040401014', rollNumber: '23040401014', fullName: 'MD. TARIKUL ISLAM SOHAG', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.ADMIN, attendancePercent: 80, cgpa: 2.99, profileImageUrl: getAvatar('23040401014') },
  { id: '23040401015', rollNumber: '23040401015', fullName: 'MD. MOSTAKIMUR RAHMAN RIMAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.13, profileImageUrl: getAvatar('23040401015') },
  { id: '23040401016', rollNumber: '23040401016', fullName: 'MD. NAJMUL HASAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 2.98, profileImageUrl: getAvatar('23040401016') },
  { id: '23040401017', rollNumber: '23040401017', fullName: 'S. ARIN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 77, cgpa: 2.88, failedSubjects: ['Math-I', 'Chem-II'], profileImageUrl: getAvatar('23040401017') },
  { id: '23040401018', rollNumber: '23040401018', fullName: 'MD. BADSHA SARKER', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.15, profileImageUrl: getAvatar('23040401018') },
  { id: '23040401019', rollNumber: '23040401019', fullName: 'MD. SHAHADAT HOSEN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.30, profileImageUrl: getAvatar('23040401019') },
  { id: '23040401020', rollNumber: '23040401020', fullName: 'MD. MUSFIQUR RAHMAN RIFAT', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 93, cgpa: 3.77, profileImageUrl: getAvatar('23040401020') },
  { id: '23040401021', rollNumber: '23040401021', fullName: 'HASIN RAIHAN SAJID', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.CR, attendancePercent: 94, cgpa: 3.87, profileImageUrl: getAvatar('23040401021') },
  { id: '23040401022', rollNumber: '23040401022', fullName: 'MD. SALMAN HASAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.88, profileImageUrl: getAvatar('23040401022') },
  { id: '23040401023', rollNumber: '23040401023', fullName: 'MD. ESTYAK AHAMMOD SONNY', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.28, profileImageUrl: getAvatar('23040401023') },
  { id: '23040401024', rollNumber: '23040401024', fullName: 'MD. JAMIL HOSSAIN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.30, profileImageUrl: getAvatar('23040401024') },
  { id: '23040401025', rollNumber: '23040401025', fullName: 'ROWNOK HASAN RUHAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.22, profileImageUrl: getAvatar('23040401025') },
  { id: '23040401026', rollNumber: '23040401026', fullName: 'MD. TAIFUR HOSSAIN CHOWDHURY', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 92, cgpa: 3.71, profileImageUrl: getAvatar('23040401026') },
  { id: '23040401027', rollNumber: '23040401027', fullName: 'SAMIA BINTE SOHEL', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.16, profileImageUrl: getAvatar('23040401027') },
  { id: '23040401028', rollNumber: '23040401028', fullName: 'ABU RAIHAN SIAM', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 86, cgpa: 3.39, profileImageUrl: getAvatar('23040401028') },
  { id: '23040401029', rollNumber: '23040401029', fullName: 'FARDIN KHAN', department: 'AE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 82, cgpa: 3.21, profileImageUrl: getAvatar('23040401029') },
  { id: '22040401002', rollNumber: '22040401002', fullName: 'ASMA AKTER MORIOM', department: 'AE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 86, cgpa: 3.38, profileImageUrl: getAvatar('22040401002') },
  { id: '22040401011', rollNumber: '22040401011', fullName: 'SREELA BANERJEE', department: 'AE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 87, cgpa: 3.40, profileImageUrl: getAvatar('22040401011') },
  { id: '22040401016', rollNumber: '22040401016', fullName: 'ISMA AZAM AKASH', department: 'AE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 89, cgpa: 3.57, profileImageUrl: getAvatar('22040401016') },

  // --- WPE (Wet Process Engineering) - 230403... ---
  { id: '23040301001', rollNumber: '23040301001', fullName: 'MD. WAHIDUL ISLAM MAMID', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.CR, attendancePercent: 85, cgpa: 3.25, profileImageUrl: getAvatar('23040301001') },
  { id: '23040301003', rollNumber: '23040301003', fullName: 'PARTHA PRATIM KARMAKER BADHAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.CR, attendancePercent: 95, cgpa: 3.87, profileImageUrl: getAvatar('23040301003') },
  { id: '23040301004', rollNumber: '23040301004', fullName: 'DIPESH MONDAL', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 2.94, profileImageUrl: getAvatar('23040301004') },
  { id: '23040301005', rollNumber: '23040301005', fullName: 'MD. FAHAD HOSEN AKON', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 78, cgpa: 2.89, failedSubjects: ['PSE'], profileImageUrl: getAvatar('23040301005') },
  { id: '23040301006', rollNumber: '23040301006', fullName: 'MD. IMTIAJ SARDER', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 79, cgpa: 2.85, profileImageUrl: getAvatar('23040301006') },
  { id: '23040301007', rollNumber: '23040301007', fullName: 'MEHEDI HASAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.14, profileImageUrl: getAvatar('23040301007') },
  { id: '23040301008', rollNumber: '23040301008', fullName: 'FARHAN SAKIB SIKDER', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 87, cgpa: 3.43, profileImageUrl: getAvatar('23040301008') },
  { id: '23040301009', rollNumber: '23040301009', fullName: 'EFFAT ZAMAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 77, cgpa: 2.77, profileImageUrl: getAvatar('23040301009') },
  { id: '23040301010', rollNumber: '23040301010', fullName: 'MD. ATIKUR RAHAMAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 76, cgpa: 2.77, failedSubjects: ['CTCA'], profileImageUrl: getAvatar('23040301010') },
  { id: '23040301011', rollNumber: '23040301011', fullName: 'DIPON SAHA', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 2.94, profileImageUrl: getAvatar('23040301011') },
  { id: '23040301012', rollNumber: '23040301012', fullName: 'MD:SAFIUL ISLAM SIAM', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.19, profileImageUrl: getAvatar('23040301012') },
  { id: '23040301013', rollNumber: '23040301013', fullName: 'SWAPNIL DAS DEVOBROTO', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.22, profileImageUrl: getAvatar('23040301013') },
  { id: '23040301015', rollNumber: '23040301015', fullName: 'MIZANUR RAHMAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.26, profileImageUrl: getAvatar('23040301015') },
  { id: '23040301017', rollNumber: '23040301017', fullName: 'APALOK ADHIKARI BRINTO', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 65, cgpa: 2.58, failedSubjects: ['Phy-II'], profileImageUrl: getAvatar('23040301017') },
  { id: '23040301019', rollNumber: '23040301019', fullName: 'MD. JUNAYET HOSSAIN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.20, profileImageUrl: getAvatar('23040301019') },
  { id: '23040301020', rollNumber: '23040301020', fullName: 'MD. SHEHABUR KHAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 77, cgpa: 2.74, failedSubjects: ['WPP', 'CTCA'], profileImageUrl: getAvatar('23040301020') },
  { id: '23040301021', rollNumber: '23040301021', fullName: 'MD. AL-JAMIU', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 85, cgpa: 3.22, profileImageUrl: getAvatar('23040301021') },
  { id: '23040301022', rollNumber: '23040301022', fullName: 'MD. SIFATUL ISLAM RABBY', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 88, cgpa: 3.44, profileImageUrl: getAvatar('23040301022') },
  { id: '23040301023', rollNumber: '23040301023', fullName: 'MD. NISHAT HOSSAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 88, cgpa: 3.44, profileImageUrl: getAvatar('23040301023') },
  { id: '23040301024', rollNumber: '23040301024', fullName: 'SAMIUL HASAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 84, cgpa: 3.18, failedSubjects: ['PSE'], profileImageUrl: getAvatar('23040301024') },
  { id: '23040301026', rollNumber: '23040301026', fullName: 'MD. MAHEDI HASAN', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 83, cgpa: 3.15, failedSubjects: ['CP'], profileImageUrl: getAvatar('23040301026') },
  { id: '23040301027', rollNumber: '23040301027', fullName: 'MD. LIMON MIA', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 70, cgpa: 2.68, failedSubjects: ['PSE', 'WPP', 'CTCA'], profileImageUrl: getAvatar('23040301027') },
  { id: '23040301028', rollNumber: '23040301028', fullName: 'ASHISH BARAI', department: 'WPE', batch: '15th Batch', level: 3, term: 1, role: UserRole.STUDENT, attendancePercent: 68, cgpa: 2.65, failedSubjects: ['CTCA', 'TP'], profileImageUrl: getAvatar('23040301028') },
  { id: '22040301010', rollNumber: '22040301010', fullName: 'FAHIM SHAHRIYAR', department: 'WPE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 71, cgpa: 2.67, failedSubjects: ['Phy-I', 'PSE'], profileImageUrl: getAvatar('22040301010') },
  { id: '22040301015', rollNumber: '22040301015', fullName: 'CHAKLADER ZIHADUL ISLAM OPU', department: 'WPE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 80, cgpa: 3.00, profileImageUrl: getAvatar('22040301015') },
  { id: '22040301018', rollNumber: '22040301018', fullName: 'KHONDKAR TAHIA ARAFATH', department: 'WPE', batch: '14th Batch', level: 2, term: 1, role: UserRole.STUDENT, attendancePercent: 69, cgpa: 2.66, profileImageUrl: getAvatar('22040301018') }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'n1',
    userRoll: '23040401014',
    title: 'Data Structures Algo',
    content: 'Remember to revise Binary Search Trees and AVL rotations.',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_RESOURCES: PDFResource[] = [
  {
    id: 'r1',
    level: 2,
    term: 1,
    department: 'AE',
    subjectName: 'Data Structures',
    driveLink: 'https://google.com',
    addedBy: '23040401014'
  },
  {
    id: 'r2',
    level: 2,
    term: 1,
    department: 'FE',
    subjectName: 'Circuit Analysis',
    driveLink: 'https://google.com',
    addedBy: '23040401014'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'c1',
    senderRoll: '23040301003',
    senderName: 'PARTHA PRATIM',
    content: 'Class Rescheduled to 11AM.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    batchId: '15th Batch'
  }
];

export const DEPARTMENTS = ['YE', 'FE', 'AE', 'WPE'];