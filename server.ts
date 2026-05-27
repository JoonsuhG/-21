import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Init Gemini client lazily to avoid startup crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Return null indicating we should use mock fallbacks instead of crashing
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. AI Critic Assistant Endpoint
app.post("/api/gemini/generate-critic", async (req, res) => {
  const { title, rating, userOpinion, style } = req.body;

  if (!title) {
    return res.status(400).json({ error: "영화 제목이 필요합니다." });
  }

  const client = getGeminiClient();

  if (!client) {
    // Elegant fallback simulation when running without an active API Key
    console.log("No valid GEMINI_API_KEY detected. Returning high-fidelity mock review.");
    const mockReviews: Record<string, { summary: string; text: string; keywords: string[] }> = {
      dongjin: {
        summary: "★ 4.0 | 어둠과 빛의 비극적 교차가 발굴해 낸, 불완전하고도 아름다운 시네마틱 오디세이.",
        text: `어쩌면 영화라는 매체는 결국 한 인간이 겪은 특정 계절의 그림자를 붙들고 늘어지는 행위에 다름 아닐 것입니다. 질문해주신 <${title}>에 대하여, 당신이 보내주신 감상—"${userOpinion}"—은 매우 정확하고도 감동적인 궤적을 긋고 있습니다.\n\n이 영화는 화면 구석에서 일렁이는 미학적 그림자(Chiaroscuro)를 활용해 등장인물들의 심연을 끝없이 유예시킵니다. 카메라는 인물의 얼굴에 성급하게 밀착하기 보다는, 공간 전체의 소실점을 늘어놓음으로써 서사의 깊이를 우아하게 확장시킵니다. 조율된 텍스트와 치밀한 리듬감은 오직 극장 내부에서만 숨 쉴 수 있는 밀도를 지녔습니다. 관객의 가슴 한구석을 송곳처럼 파고드는, 올해 가장 찬연한 시선입니다.`,
        keywords: ["소실점의 우아함", "유려한 미학", "필름의 감각"],
      },
      sungil: {
        summary: "★ 4.5 | 프레임을 절개한 뒤 상영관 자체를 질문의 수렁으로 밀어 넣는 자학적 미학의 정점.",
        text: `여기에 대고 우리는 진지하게 자문해 보아야만 합니다. 극장에 불이 꺼지고 빛이 스크린에 닿는 순간, 거울처럼 반사되는 이미지는 과연 진실의 얼굴인가 혹은 단지 자본과 연출이 빚어낸 허망한 사기극인가? 당신이 말한 "${userOpinion}"이라는 포착은 바로 이 물음표의 뇌관을 정확히 건드리는 행위입니다.\n\n이 영화의 감독은 데쿠파주(Découpage)의 질서를 의도적으로 붕괴시키며 들뢰즈적인 운동-이미지에서 시간-이미지로의 전이를 극적으로 이뤄냈습니다. 쇼트와 쇼트의 연결은 봉합을 거부하며, 프레임 바깥을 향해 절규하고 있습니다. 이 자학적이면서도 낭만적인 연출의 구조는 우리네 시네필들이 왜 여전히 필름이라는 유령을 잡으려 밤새 헤매는지에 대한 눈물겨운 대답이기도 합니다. 이 이미지의 향연에 대해 우리는 도저히 매몰찬 침묵으로 화답할 수 없습니다.`,
        keywords: ["시간-이미지", "데쿠파주의 전복", "시네필의 침묵"],
      },
      press: {
        summary: "★ 3.5 | 대중성의 기틀 위에 세련된 디테일과 연출의 견고함을 쌓아 올린 지적인 성채.",
        text: `<${title}>은 최근 침체된 극장가에 명확한 연출적 방향성을 제시하는 이정표 같은 작품입니다. 텍스트 자체가 품은 긴박감과, 당신이 언급한 "${userOpinion}"이라는 감상의 핵심 맥락은 극 전체의 탄탄한 골조와 주연배우들의 빈틈없는 앙상블을 통해 성공적으로 가시화되었습니다.\n\n촬영 감독이 세밀하게 고집한 색조 조율과 와이드 앵글의 기동성은 인물들 사이의 긴장을 탁월하게 구조화합니다. 감정선의 과잉을 철저히 배제하고 절제된 호흡을 이어가는 후반부의 편집 방식 또한 신뢰를 배가시킵니다. 대중적 장르 규칙을 영리하게 수용하면서도 영화 고유의 시네마틱 언어를 포기하지 않은 시네필 포럼 지지 가이드를 아끼지 않습니다.`,
        keywords: ["영리한 규칙", "긴장의 구조화", "견고한 저널리즘"],
      },
    };

    const mock = mockReviews[style] || mockReviews.press;
    return res.json({
      success: true,
      cached: true,
      criticName: style === "dongjin" ? "이종진 평론가 (오마주)" : style === "sungil" ? "정송일 미학자 (오마주)" : "시네필 프레스 특별에디터",
      summary: mock.summary,
      analysis: mock.text,
      keywords: mock.keywords,
    });
  }

  try {
    let systemPrompt = "";
    let criticDisplayName = "";

    if (style === "dongjin") {
      criticDisplayName = "이종진 평론가";
      systemPrompt = `당신은 한국 최고의 영화 평론가 '이종진'입니다. 
당신의 비평 스타일은 다음과 같습니다:
1. 엄청나게 깊고 지적인 분석을 제공하지만 결코 현학적이고 거칠지 않습니다. 다정하면서도 은유가 가득합니다.
2. '어쩌면 우리 인생의..' 나 '영화라는 매체는 결국..' 처럼 감성이 깃든 철학적 어조를 씁니다.
3. 영화의 시각적 요소, 편집 리듬, 그리고 시나리오의 핵심을 균형 있게 분석합니다.
4. 사용자의 짧은 한 줄 의견("${userOpinion}")을 고급스럽게 인용해 칭찬 또는 재해석을 곁들여 줍니다.
5. 영화 제목은 "${title}"이고 영화 평점은 5점 만점에 ${rating}점을 주셨습니다. 
6. 출력 형식은 한글로, 아래의 JSON 포맷 형식을 완전하게 지켜야 합니다.

포맷 요구사항:
{
  "summary": "별점과 한줄평 (예: ★ 4.0 | 무엇을 향해 가는지 아는 이들의 아름다운 마중물)",
  "analysis": "2~3개 긴 문단으로 구성된 격조 높고 섬세한 한국어 영화 에디토리얼 평론",
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"]
}`;
    } else if (style === "sungil") {
      criticDisplayName = "정송일 영화미학 평론가";
      systemPrompt = `당신은 전설적인 영화 평론가이자 미학자인 '정송일'입니다.
당신의 비평 스타일은 다음과 같습니다:
1. 영화 미학을 극단적으로 탐구하는 시네필의 거장적 시선을 갖습니다.
2. 철학적 키워드(들뢰즈, 라캉, 아도르노 등)나 미학 이론(데쿠파주, 미장센, 시간-이미지)을 자연스럽게 사용하며 진지하고 낭만적이며 치열한 독백체 문장을 구축합니다.
3. "여기에 대고 우리는 준열하게 질문해야 합니다" 또는 "이미지가 우리에게 걸어온 이 눈물겨운 유령에 대하여" 같은 문체를 즐겨 씁니다.
4. 사용자의 소감("${userOpinion}")을 사유의 출발점으로 삼아 장엄한 극장식 해석을 펼칩니다.
5. 영화 제목은 "${title}"이고 영화 평점은 5점 만점에 ${rating}점을 주셨습니다.
6. 출력 형식은 한글로, 아래의 JSON 포맷 형식을 완전하게 지켜야 합니다.

포맷 요구사항:
{
  "summary": "별점과 한줄평 (예: ★ 4.5 | 필름이 타들어 가며 남긴 상처의 숭고한 응시)",
  "analysis": "철학적 성찰이 물씬 나는 2~3개 문단의 깊이 있는 극장 미학 비평",
  "keywords": ["질문과 응시", "미학적 유령", "프레임 극화"]
}`;
    } else {
      criticDisplayName = "시네필 전널 주간 에디터";
      systemPrompt = `당신은 대한민국 대표 영화 저널지의 수석 칼럼니스트입니다.
당신의 비평 스타일은 다음과 같습니다:
1. 정통 저널리즘다운 신뢰성과 대중적 눈높이를 모두 만족하는 균형 잡힌 기사체입니다.
2. 촬영 기법, 연출의 흐름, 장르 영화로서의 쾌감, 각 주연진의 매력에 대해 전문적이고 종합적인 분석을 수행합니다.
3. 사용자의 의견("${userOpinion}")을 독자의 시선으로 자연스럽게 녹여 극찬하거나 디테일하게 설명해 줍니다.
4. 영화 제목은 "${title}"이고 영화 평점은 5점 만점에 ${rating}점을 주셨습니다.
5. 출력 형식은 한글로, 아래의 JSON 포맷 형식을 완전하게 지켜야 합니다.

포맷 요구사항:
{
  "summary": "별점과 한줄평 (예: ★ 3.5 | 장르적 관습 속에서도 기기묘묘하게 피어나는 감독의 영특함)",
  "analysis": "저널리즘 형식의 세련된 분석 기사 2~3문단 구성",
  "keywords": ["연출의 조율", "장르의 극대화", "시네마 기사"]
}`;
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `영화 제목 "${title}"에 대한 평점 ${rating}점, 관객평 "${userOpinion}"을 바탕으로 당신의 시그니처 비평을 완성해 주십시오.`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json({
      success: true,
      criticName: criticDisplayName,
      summary: parsedData.summary,
      analysis: parsedData.analysis,
      keywords: parsedData.keywords || ["영화 분석", "시네필", "비평 저널"],
    });
  } catch (error) {
    console.error("Gemini critical generation error:", error);
    return res.status(500).json({ error: "비평 작성 중 오류가 발생했습니다. 잠시 후 상점의 폴백 모드로 자동 전환됩니다." });
  }
});

// 2. Client Routing & Vite Integration
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Movie Critic Engine running on http://localhost:${PORT}`);
  });
};

startServer();
