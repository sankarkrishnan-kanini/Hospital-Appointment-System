import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async getSymptoms() {
    return this.prisma.chatbotSymptom.findMany({
      include: { specialization: true },
    });
  }

  async getFaqs(role?: string) {
    return this.prisma.chatbotFaq.findMany({
      where: role ? { role: { in: [role, 'all'] } } : undefined,
    });
  }

  async getConfig(role?: string) {
    return this.prisma.chatbotConfig.findMany({
      where: role ? { role: { in: [role, 'all'] } } : undefined,
    });
  }

  async getChatbotData(role: string) {
    const [symptoms, faqs, config] = await Promise.all([
      this.getSymptoms(),
      this.getFaqs(role),
      this.getConfig(role),
    ]);

    const symptomMap: Record<string, string> = {};
    symptoms.forEach((s) => {
      symptomMap[s.keyword] = s.specialization.specializationName;
    });

    const faqMap: Record<string, string> = {};
    faqs.forEach((f) => {
      faqMap[f.keyword] = f.answer;
    });

    const configMap: Record<string, string> = {};
    config.forEach((c) => {
      configMap[c.key] = c.value;
    });

    return { symptomMap, faqMap, config: configMap };
  }
}
