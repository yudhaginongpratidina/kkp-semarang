// hooks/useQueueCaller.ts
import { useSpeechSynthesis } from 'react-speech-kit';

const useQueueCaller = () => {
    const { speak, voices, cancel, speaking } = useSpeechSynthesis();

    // Mencari voice Indonesia terbaik di browser (Prioritas Google ID)
    const idVoice = voices.find((v: any) => v.lang.includes('id-ID') && v.name.includes('Google')) ||
        voices.find((v: any) => v.lang.includes('id'));

    const callQueue = (name: string, queueNo: number, type: string) => {
        // 1. Konfigurasi Nama Loket (Fonetik)
        const config: Record<string, string> = {
            'SMKHP': 'S M K H P,',
            'Laboratorium': 'Laboratorium,',
            'Customer Service': 'Kastemer Servis,'
        };

        // 2. Mapping Angka agar disebut 'nol' bukan 'zero'
        const map: Record<string, string> = {
            '0': 'nol', '1': 'satu', '2': 'dua', '3': 'tiga', '4': 'empat',
            '5': 'lima', '6': 'enam', '7': 'tujuh', '8': 'delapan', '9': 'sembilan'
        };

        // 3. Mapping Prefix Huruf berdasarkan Sektor
        const letterMap: Record<string, string> = {
            'SMKHP': ' A',
            'Laboratorium': ' B',
            'Customer Service': ' C'
        };

        const prefixName = config[type] || 'Unit Terkait';
        const letter = letterMap[type] || 'Nomor';

        // Format nomor: 1 -> "0 0 1" -> "nol nol satu"
        const paddedNum = String(queueNo).padStart(3, '0');
        const spokenNumbers = paddedNum.split('').map(digit => map[digit]).join(' ');

        // 4. Konstruksi Kalimat Utama
        const baseText = `Nomor antrean, ${letter}, ${spokenNumbers}, . . . Atas nama, ${name.toLowerCase()}, . . . harap menuju loket ${prefixName}.`;

        // 5. Membuat Jeda 2 Detik (Koma beruntun memberikan jeda tanpa memutus stream audio)
        const jeda2Detik = ", , , , , ,";
        const fullText = `${baseText} ${jeda2Detik} . . . Sekali lagi . . . ${baseText}`;

        // 6. Eksekusi
        cancel();

        speak({
            text: fullText,
            voice: idVoice,
            rate: 0.85, // Kecepatan bicara
            pitch: 1.1, // lebih ramah
        });
    };

    return { callQueue, speaking, cancel };
};

export default useQueueCaller;