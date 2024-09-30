export async function onKeydownScanner(
  event: KeyboardEvent
): Promise<string | null> {
  if (event.altKey) {
    event.preventDefault();
    try {
      const scannerGet = await navigator.clipboard.readText();
      const text = scannerGet ? scannerGet : null;
      return text !== null ? text.toString() : null;
    } catch (err) {
      return null;
    }
  }
  return null;
}
