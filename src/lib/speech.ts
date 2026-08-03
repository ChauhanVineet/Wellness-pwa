export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1
  window.speechSynthesis.speak(utterance)
}

export function cancelSpeech() {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
}
