export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed";
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // Ignore JSON parse failures and fall back to the default message.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}
