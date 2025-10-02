import { handleContactRequest } from './handler';

export async function POST(request: Request): Promise<Response> {
  return handleContactRequest(request);
}
