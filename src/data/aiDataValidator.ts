import aiGeneratedData from '../../artifacts/ai/ai-generated-test-data.json';
import { z } from 'zod';

const bookingSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  totalprice: z.number().int().positive(),
  depositpaid: z.boolean(),
  bookingdates: z.object({
    checkin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkout: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  }),
  additionalneeds: z.string().min(1)
});

const negativeScenarioSchema = z.object({
  name: z.string().min(1),
  method: z.enum(['POST', 'PUT', 'DELETE']),
  payload: z.record(z.unknown()),
  expectedStatuses: z.array(z.number().int()).min(1)
});

const aiOutputSchema = z.object({
  tool: z.string().min(1),
  generatedAt: z.string().datetime(),
  prompt: z.string().min(1),
  bookingTemplates: z.array(bookingSchema).min(2),
  negativeScenarios: z.array(negativeScenarioSchema).min(3)
});

export type ValidatedAiData = z.infer<typeof aiOutputSchema>;

export function getValidatedAiData(): ValidatedAiData {
  return aiOutputSchema.parse(aiGeneratedData);
}
