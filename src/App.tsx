import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Film, 
  Calendar, 
  Sparkles, 
  Maximize2, 
  Moon, 
  Sun, 
  Ticket, 
  Star, 
  ArrowRight, 
  Search, 
  ChevronRight, 
  Users, 
  Clapperboard, 
  Info,
  Check,
  RotateCcw,
  Sliders,
  Sparkle
} from "lucide-react";

// Types Declarations
interface Movie {
  id: string;
  title: string;
  engTitle: string;
  director: string;
  cast: string;
  year: number;
  duration: number;
  genre: string;
  rating: number; // Avg expert rating
  posterUrl: string;
  synopsis: string;
  quote: string;
  quoteSpeaker: string;
  curatorComment: string;
  frames: {
    title: string;
    description: string;
    analysis: string;
  }[];
}

interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theater: string;
  time: string;
  date: string;
  totalSeats: number;
  bookedSeats: number;
  price: number;
}

interface TicketStub {
  showtime: Showtime;
  selectedSeats: string[];
  totalPrice: number;
  ticketNo: string;
  bookingTime: string;
}

// Initial Movie Datasets (High Quality curated masterpieces)
const INITIAL_MOVIES: Movie[] = [
  {
    id: "m1",
    title: "헤어질 결심",
    engTitle: "Decision to Leave",
    director: "박찬욱",
    cast: "탕웨이, 박해일, 이정현",
    year: 2022,
    duration: 138,
    genre: "로맨스, 미스터리, 서스펜스",
    rating: 4.8,
    posterUrl: "https://images.unsplash.com/photo-1542204112-373a4d7024e6?auto=format&fit=crop&q=80&w=1200", 
    synopsis: "산 정상에서 추락한 한 남자의 변사 사건. 담당 형사 해준은 사망자의 아내 서래와 마주하게 된다. 남편의 죽음 앞에서도 특별한 동요를 보이지 않는 서래. 해준은 그녀를 용의선상에 두고 밀착 감시하면서 점차 그녀에게 매혹당해 간다. 붕괴와 집착 사이, 안개 자욱한 서해바다에서 펼쳐지는 파멸적 낭만주의.",
    quote: "내가 품위 있다고 했습니까? 나의 품위는 어디서 나오는지 압니까? 바로 내 자부심입니다. 그 자부심이 철저히 무너져 내렸을 때, 나는 이미 붕괴했었습니다.",
    quoteSpeaker: "해준 (박해일 분)",
    curatorComment: "박찬욱 감독의 눈부시도록 우아한 원숙미. 폭력과 에로티시즘의 표면을 걷어내고도, 쇼트의 프레임과 시선의 심연만으로도 온 마음에 마찰 자국을 남긴다.",
    frames: [
      {
        title: "Chiaroscuro: 녹색 고요와 청색 안개 사이의 유보",
        description: "녹색인지 청색인지 모호한 벽지, 모호한 서래의 원피스는 모호한 사랑의 본질을 대변한다.",
        analysis: "서래의 거처에 자리 잡은 녹청색 원 패턴 벽지는 인위적인 벽의 경계를 침식하며 바다 같은 심연을 조형합니다. 서래가 입고 있는 푸른 빛의 옷은 해준의 망막 속에서 때때로 짙은 녹색으로 보초를 서며, 조명 환경의 차이에 따른 인물의 도덕적 가치 변화를 조율합니다."
      },
      {
        title: "안과의의 시선: 폰 액정과 눈동자의 반사 레이어",
        description: "디지털 기기의 차가운 불빛이 망막에 투과되는 미장센의 다층 구조.",
        analysis: "작품 전반에 등장하는 휴대전화 스크린은 3인칭의 전지적 렌즈를 거쳐 인물의 동공에 직접 맺힙니다. 이는 감시 매체를 은유하는 동시에, 직접 만질 수 없는 원격의 연인들이 발현하는 자폐적 로맨티시즘의 시각적 증명입니다."
      }
    ]
  },
  {
    id: "m2",
    title: "존 오브 인터레스트",
    engTitle: "The Zone of Interest",
    director: "조나단 글레이저",
    cast: "산드라 휠러, 크리스티안 프리에델",
    year: 2023,
    duration: 105,
    genre: "드라마, 전쟁, 역사",
    rating: 4.7,
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=1200",
    synopsis: "아우슈비츠 수용소 담장 바로 너머의 안락한 정원. 수용소장 루돌프 회스와 그의 아내 헤트비히는 꽃이 흐드러지게 핀 넓은 마당에서 아이들과 수영을 즐기며 완벽한 이상적 삶을 일군다. 수용소 담벼락을 타고 흐르는 비명과 붉은 화장터 연기마저 아름다운 정원의 일상이 되어버린 아득한 평화의 공포.",
    quote: "여기는 우리가 꿈꿔왔던 완벽한 낙원이야. 아이들은 안전하고 꽃들은 풍성하게 자라나지. 아무도 우리를 여기서 쫓아낼 수는 없어.",
    quoteSpeaker: "헤트비히 (산드라 휠러 분)",
    curatorComment: "악의 평범성에 바치는 또 하나의 소름 끼치는 기념비. 단 한 번도 수용소 내부에 카메라를 들이밀지 않음으로써 더욱 지독하고 서늘한 도덕적 극치를 환기시킨다.",
    frames: [
      {
        title: "악의 기하학: 담장의 단단한 직선 구조",
        description: "회스 가문의 우아한 평화와 수용소의 거친 콘크리트 담장이 자아내는 극도의 비대칭 격벽 설계.",
        analysis: "정원의 푸른 관목숲 위로 수평선을 그리는 흰색 담장은 그 자체로 완벽한 차단의 매개입니다. 카메라는 광각 렌즈를 고집하여 담장의 수치들을 정원 가장자리에 완벽히 밀착시킴으로써, 의식적 망각이 일개 개인의 조경 미학 속에서 어떻게 군대식으로 재현되는지 도해합니다."
      },
      {
        title: "사형실의 이명: 소리를 증언하는 침음의 레이어",
        description: "평화로운 정적을 침식해 들어오는 가마의 진동음과 희미한 고함소리.",
        analysis: "영화는 완벽히 고정된 다층 카메라 세팅으로 촬영되는 동안, 오디오는 수용소 내부의 산업적 소음들을 가상의 사운드스케이프로 심어 두었습니다. 시각이 눈부신 햇살을 향할 때 청각은 뒤편의 비명을 응시하며, 지옥과 천국의 기괴한 이중 노출을 만들어 냅니다."
      }
    ]
  },
  {
    id: "m3",
    title: "가여운 것들",
    engTitle: "Poor Things",
    director: "요르고스 란티모스",
    cast: "엠마 스톤, 마크 러팔로, 윌렘 대포",
    year: 2023,
    duration: 141,
    genre: "SF, 판타지, 로맨스",
    rating: 4.6,
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200",
    synopsis: "젊은 여성의 몸에 갓 태어난 아기의 뇌를 이식받아 부활한 기묘한 피조물 벨라 백스터. 그녀는 편견 없이 세상을 처음 마주하며 계몽과 성욕, 자각의 모험을 떠난다. 어설픈 신화와 빅토리아 시대를 뒤흔드는 바로크풍 비주얼 아방가르드.",
    quote: "저는 결함이 있고, 쾌락을 열망하는 야생의 존재예요. 하지만 저만의 항해를 통해 마침내 제가 위대한 우주의 선장이라는 것을 알아버렸어요.",
    quoteSpeaker: "벨라 백스터 (엠마 스톤 분)",
    curatorComment: "요르고스 란티모스 감독의 괴이한 마술적 가소성. 어안렌즈의 찌그러진 왜곡과 초실현 컬러리즘이 엠마 스톤의 경이로운 신체성과 결탁해 완전한 해방을 호흡한다.",
    frames: [
      {
        title: "피쉬아이 아일랜드: 극단적인 변형과 어안 왜곡",
        description: "세계의 자궁 속을 연상시키는 둥글게 함몰된 세트와 굴절 쇼트.",
        analysis: "벨라가 런던의 기괴한 저택에서 아기처럼 거닐 때 사용된 어안 렌즈는 공간의 천장과 벽을 반원의 돔 형태로 찌그러트립니다. 이는 일종의 실험실 유리 비커의 내부처럼 조영되어, 지식인과 남성 중심 사회가 그녀를 주시하는 통제적 시선의 미학적 현현입니다."
      },
      {
        title: "바로크풍 하이브리드: 흑백에서 환각적 테크니컬러로",
        description: "지적 계몽의 여정에 맞물려 흑백 필름에서 눈부신 원색의 대륙으로 변화하는 스펙트럼.",
        analysis: "벨라가 성문 밖으로 뛰쳐나와 리스본에 닿는 순간, 영화는 단색조의 아늑함을 단번에 찢고 기괴할 정도로 포화된 황금빛과 코발트블루의 채색 세계를 밀어 넣습니다. 인류 문명의 복잡다단한 질서와 격조를 마주했을 때 뇌리에 펼쳐지는 지각의 환희를 시각적으로 은하수처럼 펼친 것입니다."
      }
    ]
  },
  {
    id: "m4",
    title: "라라랜드",
    engTitle: "La La Land",
    director: "데이미언 셔젤",
    cast: "라이언 고슬링, 엠마 스톤",
    year: 2016,
    duration: 128,
    genre: "뮤지컬, 드라마, 로맨스",
    rating: 4.5,
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    synopsis: "꿈꾸는 사람들의 도시 LA. 재즈 클럽을 열고 싶은 피아니스트 세바스찬과 배우 지망생 미아는 서로의 서투른 비행에 연료가 되어준다. 가을의 기운이 지나가고 맞이한 기막힌 평행우주 엔딩 속, 피아노 선율과 함께 쏟아지는 아득한 소회들의 총경.",
    quote: "그냥 이 흘러가는 대로 맡겨보자. 꿈의 끝자락이 어디인지는 모르겠지만, 적어도 우리가 마주 나누었던 이 보랏빛 노을은 절대 녹슬지 않을 테니까.",
    quoteSpeaker: "세바스찬 (라이언 고슬링 분)",
    curatorComment: "황혼녘 보랏빛으로 물든 선셋 대로 위 투-샷의 찬란함. 만약 우리의 다른 운명이 저 계단 어딘가에서 피아노 음률과 조우했더라면 어땠을까 하는 영원한 2순위의 탄식.",
    frames: [
      {
        title: "매직 아워: 자줏빛 하늘의 감성적 조색",
        description: "노을과 어둠이 맞물리는 마법 같은 찰나의 순간을 포착한 와이드 시네마스코프.",
        analysis: "언덕 실루엣과 저녁하늘이 교차하는 지점에서 카메라는 일절의 컷 분할 없이 롱테이크로 인물들의 도약과 미끄러짐을 바라봅니다. 자연의 보랏빛 조명은 기계적 스포트라이트와 겹치며 두 시네마 드림러가 디딘 차가운 현실을 환상으로 채색합니다."
      }
    ]
  }
];

// Curated Critic Readings (Expert 20-character rating lists)
const EXPERT_RATINGS = [
  { movieTitle: "헤어질 결심", critic: "박형식 수석평론가", score: 4.0, comment: "붕괴하는 낭만, 우아한 절벽과 탕웨이라는 마법." },
  { movieTitle: "헤어질 결심", critic: "이동진 평론가", score: 5.0, comment: "어둠과 빛의 비극적 교차가 발굴해 낸, 잊지 못할 붕괴의 마취." },
  { movieTitle: "존 오브 인터레스트", critic: "송유진 영화저널리스트", score: 4.5, comment: "보이지 않는 수치들을 조형하는 완벽한 사운드의 정밀 설계." },
  { movieTitle: "존 오브 인터레스트", critic: "정한식 미학자", score: 5.0, comment: "우아함의 가면 뒤에 도사린 차가운 무위의 기형성." },
  { movieTitle: "가여운 것들", critic: "김혜린 전문칼럼니스트", score: 4.5, comment: "세계라는 거대한 장난감을 해체하고 조립하는 눈부신 항해." },
  { movieTitle: "라라랜드", critic: "이종진 평론가", score: 4.5, comment: "흘러가는 선율마저 소리 내어 울며 되돌아오는 만약에의 성당." }
];

// Showtimes Datasets for Screening Rooms
const INITIAL_SHOWTIMES: Showtime[] = [
  // Today's showtimes (Date is 2026-05-27 based on system date)
  { id: "s1", movieId: "m1", movieTitle: "헤어질 결심", theater: "시네마 파라디소관", time: "11:30", date: "05.27 (수)", totalSeats: 60, bookedSeats: 24, price: 12000 },
  { id: "s2", movieId: "m1", movieTitle: "헤어질 결심", theater: "느와르 전용관", time: "14:15", date: "05.27 (수)", totalSeats: 35, bookedSeats: 31, price: 14000 },
  { id: "s3", movieId: "m2", movieTitle: "존 오브 인터레스트", theater: "시네마 파라디소관", time: "16:40", date: "05.27 (수)", totalSeats: 60, bookedSeats: 12, price: 12000 },
  { id: "s4", movieId: "m3", movieTitle: "가여운 것들", theater: "아방가르드 아지트", time: "19:10", date: "05.27 (수)", totalSeats: 48, bookedSeats: 42, price: 13000 },
  { id: "s5", movieId: "m4", movieTitle: "라라랜드", theater: "느와르 전용관", time: "22:00", date: "05.27 (수)", totalSeats: 35, bookedSeats: 15, price: 14000 },
  
  // Tomorrow's showtimes
  { id: "s6", movieId: "m1", movieTitle: "헤어질 결심", theater: "시네마 파라디소관", time: "12:00", date: "05.28 (목)", totalSeats: 60, bookedSeats: 4, price: 12000 },
  { id: "s7", movieId: "m2", movieTitle: "존 오브 인터레스트", theater: "느와르 전용관", time: "15:30", date: "05.28 (목)", totalSeats: 35, bookedSeats: 8, price: 14000 },
  { id: "s8", movieId: "m3", movieTitle: "가여운 것들", theater: "시네마 파라디소관", time: "18:20", date: "05.28 (목)", totalSeats: 60, bookedSeats: 19, price: 12000 },
  { id: "s9", movieId: "m4", movieTitle: "라라랜드", theater: "아방가르드 아지트", time: "21:00", date: "05.28 (목)", totalSeats: 48, bookedSeats: 26, price: 13000 }
];

export default function App() {
  const [theme, setTheme] = useState<"lite" | "noir">("lite");
  const [movies] = useState<Movie[]>(INITIAL_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie>(INITIAL_MOVIES[0]);
  
  // AI Critic States
  const [aiForm, setAiForm] = useState({
    title: INITIAL_MOVIES[0].title,
    customTitle: "",
    rating: 4.5,
    userOpinion: "인물들의 무너져가는 붕괴의 눈빛들이 잊히지 않는다.",
    style: "dongjin"
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    criticName: string;
    summary: string;
    analysis: string;
    keywords: string[];
  } | null>(null);

  // Seat booking states
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookedTicket, setBookedTicket] = useState<TicketStub | null>(null);

  // Active dates filtering
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("05.27 (수)");

  // Toggle application theme smoothly
  const toggleTheme = () => {
    setTheme((prev) => (prev === "lite" ? "noir" : "lite"));
  };

  useEffect(() => {
    // Synchronize HTML body class to allow standard tailwind styling overrides
    const body = document.body;
    if (theme === "noir") {
      body.classList.remove("bg-[#fcfbf9]", "text-[#111]");
      body.classList.add("bg-[#0c0c0e]", "text-[#e2e1df]");
    } else {
      body.classList.remove("bg-[#0c0c0e]", "text-[#e2e1df]");
      body.classList.add("bg-[#fcfbf9]", "text-[#111]");
    }
  }, [theme]);

  // Request server for AI Critic Ticket output
  const handleGenerateAiCritic = async (e: FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiResult(null);

    const targetTitle = aiForm.customTitle.trim() !== "" ? aiForm.customTitle : aiForm.title;

    try {
      const response = await fetch("/api/gemini/generate-critic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: targetTitle,
          rating: aiForm.rating,
          userOpinion: aiForm.userOpinion || "영화 고유의 색감과 음악에 깃든 전율",
          style: aiForm.style
        })
      });

      if (!response.ok) {
        throw new Error("Server response failed");
      }

      const data = await response.json();
      setAiResult({
        criticName: data.criticName,
        summary: data.summary,
        analysis: data.analysis,
        keywords: data.keywords
      });
    } catch (err) {
      console.error("AI Generation error:", err);
      // Fallback in case something is disconnected
      setAiResult({
        criticName: "시네필 포럼 공동 에디터",
        summary: `★ ${aiForm.rating} | 영화 <${targetTitle}>에 관한 탁월한 감상의 여정`,
        analysis: `당신이 전해주신 한 줄평—"${aiForm.userOpinion}"—은 시네필의 날카로움이 서려 있는 탁월한 미적 시선입니다. 영화 고유가 추구하는 은유적 설계와 사운드트랙에 깃든 긴박감은 이미 상영관 전체를 낭만적으로 휘덮었을 것입니다. 이 명작을 다시 한번 사유하는 밤, 은은한 스크린의 조각들을 기리며 박수갈채를 보냅니다.`,
        keywords: ["즉흥적 감성", "영화적 사색", "시네필 파라디소"]
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSeatClick = (seatCode: string) => {
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatCode));
    } else {
      setSelectedSeats(prev => [...prev, seatCode]);
    }
  };

  const handleCompleteBooking = () => {
    if (!selectedShowtime || selectedSeats.length === 0) return;
    
    const randomTicketNo = "CINE-" + Math.floor(100000 + Math.random() * 900000);
    const now = new Date();
    const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newTicket: TicketStub = {
      showtime: selectedShowtime,
      selectedSeats: [...selectedSeats],
      totalPrice: selectedSeats.length * selectedShowtime.price,
      ticketNo: randomTicketNo,
      bookingTime: formattedTime
    };

    setBookedTicket(newTicket);
    setSelectedSeats([]);
  };

  // Pre-calculated rows of seats
  const SEAT_ROWS = ["A", "B", "C", "D", "E"];
  const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8];

  // Colors based on current theme
  const borderCol = theme === "noir" ? "border-zinc-800" : "border-stone-200";
  const bgCard = theme === "noir" ? "bg-[#16161a]" : "bg-white";
  const textMuted = theme === "noir" ? "text-zinc-400" : "text-stone-600";
  const textTitle = theme === "noir" ? "text-white font-serif-kr" : "text-stone-900 font-serif-kr";
  const brandRed = "text-cine-red";

  return (
    <div className={`min-h-screen font-sans antialiased magazine-paper-grain transition-editorial duration-500`}>
      {/* 1. Header Area with dynamic editorial volume info */}
      <header className={`border-b ${theme === "noir" ? "border-zinc-900 bg-cine-black" : "border-stone-300 bg-white"} sticky top-0 z-40 transition-editorial`}>
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* CINEPHILIA Logo mimicking high-end Korean/English design */}
            <div className="flex flex-col text-left">
              <span className={`text-2xs font-mono tracking-widest ${theme === "noir" ? "text-zinc-500" : "text-stone-500"} uppercase`}>EDITORIAL & CRITIQUE</span>
              <div className="flex items-baseline space-x-1.5 -mt-1">
                <span className={`text-2xl sm:text-3xl font-extrabold tracking-tighter ${theme === "noir" ? "text-white" : "text-stone-900"}`}>
                  CINE<span className="text-cine-red">PHILIA</span>
                </span>
                <span className={`text-xs font-serif-en italic tracking-wider ${theme === "noir" ? "text-cine-gold" : "text-stone-500"}`}>Archive</span>
              </div>
            </div>
            
            <div className={`hidden md:flex border-l pl-4 ${theme === "noir" ? "border-zinc-800" : "border-stone-200"} flex-col text-left`}>
              <span className="text-2xs font-mono text-zinc-500 leading-none">CRITIQUE PORTAL</span>
              <span className={`text-xs font-serif-kr ${textMuted}`}>시네필을 위한 미학 분석 & 아카이브</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live activity indicator / Clean, humble and literal */}
            <div className={`hidden sm:flex items-center space-x-2 px-2 py-1 rounded-sm text-2xs font-mono border ${theme === "noir" ? "border-zinc-800 bg-zinc-900/40 text-cine-gold" : "border-stone-300 bg-stone-100/60 text-stone-600"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PORTAL ONLINE</span>
            </div>

            {/* High fidelity Theme Switcher */}
            <button
              onClick={toggleTheme}
              id="theme-toggler"
              className={`p-2 rounded-sm border ${theme === "noir" ? "border-zinc-800 text-zinc-300 hover:bg-zinc-900" : "border-stone-300 text-stone-800 hover:bg-stone-100"} transition-editorial`}
              title={theme === "lite" ? "느와르 극장 테마 켜기" : "라이트 미니멀 테마 켜기"}
            >
              {theme === "lite" ? (
                <div className="flex items-center space-x-2 text-xs">
                  <Moon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-mono">Noir Mode</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs">
                  <Sun className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-mono">Lite Minimal</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Issue Highlights Selector - Side by side editorial grid */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:py-8 space-y-10">
        
        {/* SECTION 1: COVER STAR WIDE STORY (Magical presentation) */}
        <section id="cover-star-hero" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Poster Section with hover parallax zoom simulation */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-cine-red text-white text-3xs font-semibold px-2 py-0.5 rounded-sm tracking-uppercase">FEATURED FILM</span>
                <span className={`text-2xs font-mono tracking-wider ${theme === "noir" ? "text-cine-gold" : "text-stone-500"}`}>EDITORIAL FOCUS</span>
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold ${theme === "noir" ? "text-white" : "text-[#111]"} leading-tight tracking-tight`}>
                {selectedMovie.title}
              </h1>
              <p className={`text-sm font-serif-en italic ${theme === "noir" ? "text-cine-gold" : "text-stone-500"} mt-1`}>
                {selectedMovie.engTitle} | 감독 {selectedMovie.director}
              </p>
            </div>

            {/* Styled Movie Poster Frame with premium shadows */}
            <div className="relative group overflow-hidden rounded-md cursor-pointer border border-zinc-900 shadow-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/5] max-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              
              <img 
                src={selectedMovie.posterUrl} 
                alt={selectedMovie.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Dynamic Overlay when hovering */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 text-white text-left">
                <span className="text-3xs font-mono tracking-widest text-[#ccd5e0] uppercase">CLASSIC DIALOGUE OF THE WEEK</span>
                <p className="font-serif-kr text-sm sm:text-base leading-relaxed text-zinc-100 font-light mt-1">
                  &ldquo;{selectedMovie.quote}&rdquo;
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xs font-mono text-cine-gold">— {selectedMovie.quoteSpeaker}</span>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{selectedMovie.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro selector buttons under poster for interactive movie selection */}
            <div className="grid grid-cols-4 gap-2">
              {movies.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMovie(m)}
                  className={`px-2 py-2 rounded-sm text-left border text-xs transition-all ${
                    selectedMovie.id === m.id 
                    ? "border-cine-red bg-cine-red/10 text-cine-red font-bold" 
                    : (theme === "noir" ? "border-zinc-800 text-zinc-400 hover:bg-zinc-900" : "border-stone-300 text-stone-600 hover:bg-stone-100")
                  }`}
                >
                  <p className="truncate font-serif-kr font-medium">{m.title}</p>
                  <p className="text-4xs font-mono truncate uppercase opacity-60">{m.engTitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Analysis & Framing Section (Cinephile goldmine) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Upper Editorial Text Panel */}
            <div className={`p-5 sm:p-6 rounded-md border ${theme === "noir" ? "bg-zinc-900/30 border-zinc-900" : "bg-white border-stone-200"} space-y-4`}>
              <div className="flex items-center space-x-2">
                <Clapperboard className="w-4 h-4 text-cine-red" />
                <h3 className={`text-base font-bold tracking-tight uppercase font-serif-kr ${theme === "noir" ? "text-zinc-200" : "text-stone-800"}`}>
                  큐레이터 기획 해설 : 심연의 서사
                </h3>
              </div>
              <p className={`text-sm leading-relaxed font-serif-kr ${theme === "noir" ? "text-zinc-300" : "text-stone-700"} text-justify`}>
                {selectedMovie.synopsis}
              </p>

              <div className={`p-3 rounded-sm border-l-2 border-cine-red ${theme === "noir" ? "bg-zinc-900/40 text-zinc-300" : "bg-stone-50 text-stone-800"} text-justify italic text-xs leading-relaxed font-serif-kr`}>
                &ldquo;{selectedMovie.curatorComment}&rdquo;
              </div>
            </div>

            {/* Lower In-depth Frame analysis (Reconstructing the detail card) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cine-gold" />
                  <h3 className={`text-sm font-extrabold tracking-uppercase font-serif-kr ${theme === "noir" ? "text-white" : "text-stone-900"}`}>
                    RECONSTRUCTING THE FRAME : 미학적 프레임 분석
                  </h3>
                </div>
                <span className="text-3xs font-mono text-zinc-500 uppercase">Interactive Dossier</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMovie.frames.map((frame, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-md border text-left ${
                      theme === "noir" ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-stone-200"
                    } hover:border-cine-gold transition-editorial`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <span className="text-xs font-mono text-cine-gold font-bold bg-cine-gold/10 px-1.5 py-0.5 rounded-sm">
                        SH-0{index + 1}
                      </span>
                      <h4 className={`text-xs font-bold font-serif-kr ${theme === "noir" ? "text-zinc-200" : "text-stone-800"}`}>
                        {frame.title}
                      </h4>
                    </div>
                    
                    <p className={`text-2xs font-serif-kr font-semibold text-cine-red mt-2`}>
                      {frame.description}
                    </p>
                    
                    <p className={`text-2xs leading-relaxed font-serif-kr text-stone-500/90 dark:text-zinc-400 mt-1 lines-clamp-4`}>
                      {frame.analysis}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: LIVE AI CRITIC TICKET GENERATOR */}
        <section id="ai-critic-station" className={`p-6 sm:p-8 rounded-lg border max-w-5xl mx-auto ${
          theme === "noir" ? "bg-zinc-950/70 border-zinc-900 shadow-2xl" : "bg-white border-stone-300 shadow-xl"
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Form Controls */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cine-red animate-pulse" />
                <h2 className={`text-lg sm:text-xl font-black ${theme === "noir" ? "text-white" : "text-stone-900"} tracking-tight`}>
                  AI 평론가 비평 소환기
                </h2>
              </div>
              <p className={`text-xs leading-relaxed ${textMuted} text-justify`}>
                원하는 영화 제목과 관람 평을 아래에 입력하세요. 한국 극장 평단을 대표하는 이종진, 정송일, 씨네21 편집진 스타일로 즉석 인쇄형 시네 아티클을 생성해 드립니다.
              </p>

              <form onSubmit={handleGenerateAiCritic} className="space-y-3.5 mt-2">
                
                {/* Movie Selector / Custom Input */}
                <div className="space-y-1">
                  <label className={`block text-3xs font-mono uppercase font-bold ${textMuted}`}>1. 영화 선택 또는 직접 입력</label>
                  <div className="flex gap-2">
                    <select
                      value={aiForm.title}
                      onChange={(e) => {
                        setAiForm(prev => ({ ...prev, title: e.target.value, customTitle: "" }));
                      }}
                      className={`w-full text-xs p-2 rounded-sm border focus:outline-none focus:ring-1 focus:ring-cine-red ${
                        theme === "noir" ? "bg-zinc-900 border-zinc-800 text-white" : "bg-stone-50 border-stone-300 text-stone-900"
                      }`}
                    >
                      {movies.map(m => (
                        <option key={m.id} value={m.title}>{m.title}</option>
                      ))}
                      <option value="custom">-- 직접 쓰기 --</option>
                    </select>
                  </div>

                  {aiForm.title === "custom" && (
                    <input
                      type="text"
                      placeholder="영화 제목을 한글로 입력해 주세요. (예: 마더, 시안)"
                      value={aiForm.customTitle}
                      onChange={(e) => setAiForm(prev => ({ ...prev, customTitle: e.target.value }))}
                      required
                      className={`w-full text-xs p-2 rounded-sm border mt-1.5 focus:outline-none focus:ring-1 focus:ring-cine-red ${
                        theme === "noir" ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500" : "bg-stone-50 border-stone-300 text-stone-900"
                      }`}
                    />
                  )}
                </div>

                {/* Rating selection (0-5 stars) */}
                <div className="space-y-1">
                  <label className={`block text-3xs font-mono uppercase font-bold ${textMuted} flex justify-between`}>
                    <span>2. 평점 부여</span>
                    <span className="text-cine-red text-2xs font-sans font-bold">★ {aiForm.rating}점</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={aiForm.rating}
                    onChange={(e) => setAiForm(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                    className="w-full accent-cine-red cursor-ew-resize opacity-80"
                  />
                  <div className="flex justify-between text-4xs font-mono text-zinc-500">
                    <span>★ 1.0 (별로)</span>
                    <span>★ 3.0 (보통)</span>
                    <span>★ 5.0 (극찬)</span>
                  </div>
                </div>

                {/* Persona choice */}
                <div className="space-y-1">
                  <label className={`block text-3xs font-mono uppercase font-bold ${textMuted}`}>3. 평론가 필체 선택</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "dongjin", label: "이종진", desc: "은유와 지성" },
                      { id: "sungil", label: "정송일", desc: "철학과 과잉" },
                      { id: "cine21", label: "씨네21", desc: "저널리즘" }
                    ].map((critic) => (
                      <button
                        type="button"
                        key={critic.id}
                        onClick={() => setAiForm(prev => ({ ...prev, style: critic.id }))}
                        className={`p-2 rounded-sm border text-left flex flex-col justify-between transition-all ${
                          aiForm.style === critic.id
                          ? "border-cine-red bg-cine-red/10 text-cine-red"
                          : (theme === "noir" ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400" : "border-stone-300 hover:bg-stone-100 text-stone-600")
                        }`}
                      >
                        <span className="text-xs font-bold font-serif-kr">{critic.label}</span>
                        <span className="text-4xs font-mono uppercase opacity-70 block mt-1">{critic.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* User opinion sentence */}
                <div className="space-y-1">
                  <label className={`block text-3xs font-mono uppercase font-bold ${textMuted}`}>4. 영화 감상문 (짧은 뼈대)</label>
                  <textarea
                    rows={2}
                    placeholder="인물의 고뇌가 스며있다, 미스터리하게 끌린다 등의 감상을 적어주시면 더욱 정밀한 평론이 인용 융합되어 발행됩니다."
                    value={aiForm.userOpinion}
                    onChange={(e) => setAiForm(prev => ({ ...prev, userOpinion: e.target.value }))}
                    className={`w-full text-xs p-2 rounded-sm border focus:outline-none focus:ring-1 focus:ring-cine-red ${
                      theme === "noir" ? "bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500" : "bg-stone-50 border-stone-300 text-stone-900"
                    }`}
                  />
                </div>

                {/* Execute Button */}
                <button
                  type="submit"
                  disabled={aiLoading}
                  className={`w-full py-2.5 rounded-sm bg-cine-red text-white text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all hover:bg-[#a0181e] disabled:opacity-50 select-none shadow-md cursor-pointer`}
                >
                  <Sparkle className="w-3.5 h-3.5 fill-white animate-spin" style={{ animationDuration: "3s" }} />
                  <span>시네 아티클 티켓 발권하기</span>
                </button>
              </form>
            </div>

            {/* Right Column: Interactive Receipt Container */}
            <div className="md:col-span-7 flex flex-col items-center justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                {aiLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center space-y-4 p-8"
                  >
                    {/* Retro clapperboard rotating loading */}
                    <div className="w-12 h-12 rounded-full border-4 border-dashed border-cine-red animate-spin flex items-center justify-center">
                      <Film className="w-5 h-5 text-cine-red animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-sm font-extrabold ${theme === "noir" ? "text-zinc-200" : "text-stone-800"}`}>
                        시네필 데이터 베이스 동기화 중...
                      </h4>
                      <p className="text-3xs font-mono text-zinc-500 uppercase">
                        Querying Gemini Critic Matrix based on your taste
                      </p>
                    </div>
                  </motion.div>
                ) : aiResult ? (
                  <motion.div
                    key="receipt"
                    initial={{ y: -60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className={`w-full max-w-sm border shadow-2xl overflow-hidden rounded-md text-left text-zinc-800 bg-[#f9f8f4] border-stone-400 p-6 relative`}
                  >
                    {/* Header accent strip */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-zinc-900" />
                    
                    {/* Archival layout heading */}
                    <div className="flex items-center justify-between border-b border-stone-300 pb-3 mt-1 text-stone-900 mb-4 font-mono select-none">
                      <div>
                        <span className="text-xs font-bold font-serif-en uppercase tracking-wider text-stone-950">EDITORIAL DOSSIER</span>
                        <div className="text-4xs text-stone-500 uppercase mt-0.5">EST. 2026 | ANALYTICAL CRITIQUE ENGINE</div>
                      </div>
                      <Sparkles className="w-4 h-4 text-cine-red" />
                    </div>

                    <div className="space-y-4">
                      {/* Film Badge */}
                      <div className="space-y-1 text-center">
                        <span className="text-3xs font-mono uppercase bg-zinc-900 text-[#f9f8f4] px-1.5 py-0.5 rounded-sm inline-block">
                          {aiResult.criticName}
                        </span>
                        <h3 className="text-2xl font-black tracking-tight text-zinc-950 font-serif-kr mt-1">
                          {aiForm.title === "custom" ? aiForm.customTitle : aiForm.title}
                        </h3>
                        <p className="text-xs text-cine-red font-semibold font-serif-kr mt-0.5 italic text-center">
                          {aiResult.summary}
                        </p>
                      </div>

                      {/* Main Paragraph Body */}
                      <div className="border-t border-stone-300 pt-3 text-stone-800 text-justify text-xs leading-relaxed font-serif-kr space-y-2 whitespace-pre-wrap">
                        {aiResult.analysis}
                      </div>

                      {/* Key tags bottom */}
                      <div className="border-t border-dashed border-stone-400 pt-3">
                        <span className="text-4xs font-mono uppercase text-stone-500 block mb-1">FILM ANALYSIS METRICS</span>
                        <div className="flex flex-wrap gap-1">
                          {aiResult.keywords.map((kw, i) => (
                            <span key={i} className="text-3xs font-mono bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded-sm">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Premium archival authentication footnote in place of barcode */}
                      <div className="border-t border-stone-300 pt-3 flex items-center justify-between text-4xs font-mono select-none">
                        <div>
                          <span className="text-stone-500 block uppercase">ARCHIVED AT</span>
                          <span className="font-semibold text-zinc-950">2026.05.27 UTC</span>
                        </div>
                        <div className="text-right">
                          <span className="text-stone-500 block uppercase font-serif-en italic">Authorized Critic</span>
                          <span className="font-semibold text-zinc-950 underline leading-none">Film Review Board</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className={`p-8 border-2 border-dashed ${borderCol} rounded-md text-center max-w-sm flex flex-col items-center space-y-3`}>
                    <Sparkles className="w-8 h-8 text-cine-gold opacity-65" />
                    <div className="space-y-1">
                      <h4 className={`text-sm font-extrabold ${theme === "noir" ? "text-zinc-400" : "text-stone-700"}`}>
                        아직 소환된 아티클이 없습니다.
                      </h4>
                      <p className={`text-3xs font-mono uppercase ${textMuted}`}>
                        Configure and hit the button to print receipt
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* SECTION 3: EXPERT RATINGS GRID - 씨네21 오리지널 별점 판 */}
        <section id="critical-ratings-grid" className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2 border-stone-300 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-cine-red fill-cine-red" />
              <h2 className={`text-base font-extrabold font-serif-kr ${textTitle}`}>
                전문가 패널 촌철살인 마이크로 비평 수집선
              </h2>
            </div>
            <span className="text-3xs font-mono text-zinc-500 uppercase">Expert Consensus Panel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPERT_RATINGS.map((rate, i) => (
              <div 
                key={i}
                className={`p-4 rounded-md border text-left flex flex-col justify-between ${bgCard} ${borderCol} hover:scale-[1.01] transition-editorial`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1 bg-cine-dark/5 dark:bg-white/5 px-2 py-0.5 rounded-sm">
                    <span className="text-xs font-bold font-serif-kr">{rate.movieTitle}</span>
                    <span className="text-2xs font-mono text-cine-red font-bold">
                      {rate.critic}
                    </span>
                  </div>
                  <p className={`text-xs italic leading-relaxed font-serif-kr ${theme === "noir" ? "text-zinc-300" : "text-stone-700"} mt-2`}>
                    &ldquo;{rate.comment}&rdquo;
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 mt-3 pt-2 border-t border-dashed border-stone-200 dark:border-zinc-800">
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, starIndex) => {
                      const value = starIndex + 1;
                      if (value <= rate.score) {
                        return <Star key={starIndex} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />;
                      } else if (value - 0.5 === rate.score) {
                        return (
                          <div key={starIndex} className="relative">
                            <Star className="w-3.5 h-3.5 text-amber-500 absolute top-0 left-0 overflow-hidden w-[50%] fill-amber-500" />
                            <Star className="w-3.5 h-3.5 text-stone-300 dark:text-zinc-700" />
                          </div>
                        );
                      }
                      return <Star key={starIndex} className="w-3.5 h-3.5 text-stone-300 dark:text-zinc-700" />;
                    })}
                  </div>
                  <span className="text-2xs font-mono font-bold">{rate.score}점</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: SCREENING ROMS SHOWTIME & INTERACTIVE BOOKING SEATS */}
        <section id="theaters-showtimes" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
          
          {/* Calendar List (Showtimes Timeline) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-cine-red" />
                <h3 className={`text-sm font-extrabold tracking-uppercase font-serif-kr ${theme === "noir" ? "text-white" : "text-stone-900"}`}>
                  상영 시간표 (Cineplex 타임테이블)
                </h3>
              </div>
              <p className={`text-xs ${textMuted}`}>
                기획전 상영관들을 엄선해 데일리 프로그램을 편성했습니다. 관람을 원하는 시간대를 클릭해 좌석 현황을 직접 설계하고 시네마 티켓을 발권해 소장하십시오.
              </p>
            </div>

            {/* Timetable Date Switcher */}
            <div className={`flex border p-1 rounded-sm ${borderCol} ${theme === "noir" ? "bg-zinc-950" : "bg-white"}`}>
              {["05.27 (수)", "05.28 (목)"].map((dt) => (
                <button
                  key={dt}
                  onClick={() => {
                    setSelectedDateFilter(dt);
                    setSelectedShowtime(null);
                    setBookedTicket(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                    selectedDateFilter === dt 
                    ? "bg-cine-red text-white font-bold" 
                    : (theme === "noir" ? "text-zinc-400 hover:text-white" : "text-stone-600 hover:text-stone-900")
                  }`}
                >
                  {dt}
                </button>
              ))}
            </div>

            {/* List of current showtimes */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {INITIAL_SHOWTIMES
                .filter((s) => s.date === selectedDateFilter)
                .map((show) => {
                  const availabilityPercent = Math.round(((show.totalSeats - show.bookedSeats) / show.totalSeats) * 100);
                  const isFull = show.bookedSeats >= show.totalSeats;
                  const isSelected = selectedShowtime?.id === show.id;

                  return (
                    <div
                      key={show.id}
                      onClick={() => {
                        if (!isFull) {
                          setSelectedShowtime(show);
                          setBookedTicket(null);
                          setSelectedSeats([]);
                        }
                      }}
                      className={`p-3.5 rounded-md border text-left cursor-pointer transition-all ${
                        isFull ? "opacity-45 cursor-not-allowed" : ""
                      } ${
                        isSelected 
                        ? "border-cine-red bg-cine-red/10 scale-[0.99] ring-1 ring-cine-red" 
                        : (theme === "noir" ? "border-zinc-900 bg-zinc-950 hover:bg-zinc-900" : "border-stone-200 bg-white hover:bg-stone-50")
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black font-mono tracking-tight">{show.time}</span>
                          <span className={`text-3xs font-mono uppercase bg-zinc-900 text-white px-1.5 py-0.5 rounded-sm`}>
                            {show.theater}
                          </span>
                        </div>
                        <span className="text-2xs font-mono font-bold text-cine-red">{show.price.toLocaleString()}원</span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className={`text-xs font-serif-kr font-bold ${theme === "noir" ? "text-zinc-200" : "text-stone-800"}`}>
                          {show.movieTitle}
                        </span>
                        
                        <div className="flex items-center space-x-1.5 text-3xs font-mono">
                          <span className={isFull ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
                            {show.totalSeats - show.bookedSeats} / {show.totalSeats} 석
                          </span>
                          <span className="text-zinc-500">({availabilityPercent}% 여유)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Seat Map Selector & Real Ticket Output (Interactive centerpiece) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className={`p-5 rounded-md border h-full flex flex-col justify-between ${theme === "noir" ? "bg-zinc-950/40 border-zinc-900" : "bg-white border-stone-200"}`}>
              <AnimatePresence mode="wait">
                {bookedTicket ? (
                  /* STEP 3: BOOKING TICKET COMPLETED RECEIPT (High Fidelity design) */
                  <motion.div
                    key="booked-stub"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6"
                  >
                    <div className="w-full max-w-sm rounded-md overflow-hidden shadow-2xl bg-stone-900 text-white relative border border-stone-800">
                      {/* Gold design elements to denote classic films */}
                      <div className="bg-cine-gold px-4 py-3 text-zinc-950 font-mono text-center font-extrabold flex justify-between items-center select-none">
                        <span className="text-xs">DIGITAL TICKET SUMMARY</span>
                        <Ticket className="w-4 h-4 shrink-0" />
                      </div>

                      <div className="p-5 space-y-4 text-left font-serif-kr">
                        <div className="space-y-1 text-center border-b border-[#333] pb-3">
                          <span className="text-4xs font-mono px-2 py-0.5 bg-zinc-800 text-cine-gold rounded-sm inline-block">
                            E-TICKET SECURED
                          </span>
                          <h3 className="text-xl font-black mt-1 text-white leading-tight">
                            {bookedTicket.showtime.movieTitle}
                          </h3>
                          <p className="text-2xs font-mono text-cine-gold mt-1 uppercase">
                            {bookedTicket.showtime.theater} | {bookedTicket.showtime.time}
                          </p>
                        </div>

                        {/* Interactive transaction metrics */}
                        <div className="grid grid-cols-2 gap-3 pb-3 text-xs leading-relaxed">
                          <div>
                            <span className="text-4xs font-mono text-stone-400 block uppercase">SCREENING DATE</span>
                            <span className="font-semibold text-stone-200">{bookedTicket.showtime.date}</span>
                          </div>
                          <div>
                            <span className="text-4xs font-mono text-stone-400 block uppercase">SEAT NUMBERS</span>
                            <span className="font-semibold text-stone-200">{bookedTicket.selectedSeats.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-4xs font-mono text-stone-400 block uppercase">CONFIRMATION ID</span>
                            <span className="font-semibold text-stone-200 font-mono">{bookedTicket.ticketNo}</span>
                          </div>
                          <div>
                            <span className="text-4xs font-mono text-stone-400 block uppercase">TOTAL AMOUNT</span>
                            <span className="font-semibold text-cine-gold font-bold">{bookedTicket.totalPrice.toLocaleString()}원</span>
                          </div>
                        </div>

                        {/* Secure digital verification block in place of barcode */}
                        <div className="border-t border-[#333] pt-3 flex flex-col items-center">
                          <span className="text-4xs font-mono text-stone-400 block text-center uppercase mb-1">TRANSACTION SECURITY KEY</span>
                          <div className="text-xs font-mono font-bold tracking-widest text-cine-gold bg-[#222] px-4 py-1.5 border border-[#333] rounded-sm select-none">
                            SYS-CONFIRMED: {bookedTicket.ticketNo}
                          </div>
                          <span className="text-5xs font-mono text-stone-500 text-center mt-1">ISSUED ON: {bookedTicket.bookingTime}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setBookedTicket(null);
                        setSelectedShowtime(null);
                      }}
                      className="mt-4 px-4 py-2 rounded-sm border border-cine-red text-cine-red text-xs font-bold hover:bg-cine-red/5 transition-all select-none cursor-pointer flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>추가 상영작 예매하기</span>
                    </button>
                  </motion.div>
                ) : selectedShowtime ? (
                  /* STEP 2: SHOWTIME IS SELECTED - SEATS LIST */
                  <motion.div
                    key="seat-selector"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex flex-col justify-between h-full text-center"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-extrabold font-serif-kr text-cine-red">
                          &lt;{selectedShowtime.movieTitle}&gt; 좌석 선택 안내
                        </span>
                        <button 
                          onClick={() => setSelectedShowtime(null)}
                          className="text-4xs font-mono hover:text-cine-red underline"
                        >
                          선택 취소
                        </button>
                      </div>
                      
                      {/* Screening room Screen Simulation */}
                      <div className="w-full bg-zinc-800/15 dark:bg-white/10 text-center py-1 rounded-sm text-4xs font-mono tracking-widest text-[#111] dark:text-zinc-500 uppercase select-none my-1.5 border border-stone-300 dark:border-zinc-800">
                        SCREEN (극장 화면 방향)
                      </div>

                      {/* Interactive Seat grid */}
                      <div className="grid gap-2 py-4 justify-center">
                        {SEAT_ROWS.map((row) => (
                          <div key={row} className="flex items-center space-x-1 sm:space-x-2">
                            <span className="w-4 text-xs font-mono text-zinc-500">{row}</span>
                            <div className="flex space-x-1">
                              {SEAT_COLS.map((col) => {
                                const seatCode = `${row}${col}`;
                                // Pseudo randomized booked seats
                                const isMockBooked = (row === "A" && col <= 3) || (row === "C" && col === 5) || (row === "E" && col >= 7);
                                const isSelected = selectedSeats.includes(seatCode);

                                return (
                                  <button
                                    key={seatCode}
                                    disabled={isMockBooked}
                                    onClick={() => handleSeatClick(seatCode)}
                                    className={`w-6 h-6 rounded-sm text-4xs font-mono flex items-center justify-center transition-all cursor-pointer ${
                                      isMockBooked 
                                      ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-25" 
                                      : isSelected 
                                      ? "bg-cine-red text-white font-extrabold shadow-sm scale-105" 
                                      : (theme === "noir" 
                                        ? "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-cine-gold" 
                                        : "bg-stone-100 text-stone-700 border border-stone-300 hover:border-cine-red")
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Seat Map Legend Info */}
                      <div className="flex items-center justify-center space-x-4 text-4xs font-mono text-zinc-500">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-sm bg-zinc-800 opacity-25" />
                          <span>판매 완료</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-sm ${theme === "noir" ? "bg-zinc-900" : "bg-stone-100"} border ${theme === "noir" ? "border-zinc-800" : "border-stone-300"}`} />
                          <span>선택 가능</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 rounded-sm bg-cine-red" />
                          <span>내 선택</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing summary widget and proceed to print ticket */}
                    <div className={`mt-4 pt-3.5 border-t ${borderCol} flex items-center justify-between`}>
                      <div className="text-left">
                        <span className={`text-4xs font-mono uppercase ${textMuted}`}>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</span>
                        <p className={`text-sm font-bold font-serif-kr ${theme === "noir" ? "text-zinc-300" : "text-stone-800"}`}>
                          결제 금액: <span className="text-cine-red font-extrabold">{(selectedSeats.length * selectedShowtime.price).toLocaleString()}</span>원
                        </p>
                      </div>

                      <button
                        onClick={handleCompleteBooking}
                        disabled={selectedSeats.length === 0}
                        className="px-4 py-2 rounded-sm bg-zinc-900 dark:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-xs hover:bg-zinc-850 dark:hover:bg-white disabled:opacity-40 select-none cursor-pointer"
                      >
                        디지털 예매 티켓 발권하기
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* STEP 1: INITIAL STATE - PLEASE SELECT SHOWTIME */
                  <div className="p-8 flex flex-col items-center justify-center space-y-3 h-full my-auto text-center py-16">
                    <div className="w-12 h-12 rounded-full bg-cine-red/10 border border-cine-red/20 flex items-center justify-center">
                      <Ticket className="w-5 h-5 text-cine-red animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-sm font-extrabold ${theme === "noir" ? "text-zinc-400" : "text-stone-700"}`}>
                        상영 시간이 선택되지 않았습니다.
                      </h4>
                      <p className={`text-3xs font-mono uppercase ${textMuted}`}>
                        Choose a screening from the program on the left
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </section>

      </main>

      {/* Modern, clean and helpful design footer of the film critique platform */}
      <footer className={`border-t py-12 mt-16 text-center select-none ${
        theme === "noir" ? "border-zinc-950 bg-cine-black text-zinc-600" : "border-stone-300 bg-white text-stone-500"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-bold font-serif-kr text-[#111] dark:text-zinc-300">CINEPHILIA</span>
            <span className="text-xs font-mono">— CINEPHILE CRITIC & FRAME ANALYSIS ENGINE</span>
          </div>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            본 콘텐츠는 예술영화 비평과 미학적 프레임 분석을 연구하는 시네필 아카이브 플랫폼입니다. AI 비평 결과는 거장 평론가들의 미학적 시선을 탐색하고 풍부한 시네필 감상을 돕기 위해 생성된 지능 모델입니다.
          </p>
          <div className="text-4xs font-mono uppercase tracking-widest text-zinc-500">
            &copy; {new Date().getFullYear()} CINEPHILIA ARCHIVE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
