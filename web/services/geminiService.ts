
import { GoogleGenAI } from "@google/genai";

const apiKey =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY ||
  '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateContractPreview = async (contractData: any) => {
  if (!ai) {
    return "未配置 Gemini API Key，无法生成合同预览。请在环境变量中设置 `GEMINI_API_KEY` 后重试。";
  }
  const prompt = `
    请根据以下信息生成一个专业的 MuseGate 服务合同预览。
    合同主体: ${contractData.subjectName}
    金额: ${contractData.amount}元
    主账号: ${contractData.mainAccountName} (${contractData.mainAccountPhone})
    包含项目: ${contractData.items.join(', ')}
    赠送项目: ${contractData.bonusItems.join(', ')}
    邮寄地址: ${contractData.address}
    
    要求: 格式严谨，包含甲乙双方基本权利，使用Markdown格式。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "无法生成合同预览，请检查网络连接或API配置。";
  }
};
