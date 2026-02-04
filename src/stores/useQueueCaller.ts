// hooks/useQueueCaller.ts
import { useSpeechSynthesis } from 'react-speech-kit';

const useQueueCaller = () => {
    const { speak, voices, cancel, speaking } = useSpeechSynthesis();

    // ANALISA: Cari voice Inggris (en-US atau en-GB)
    const enVoice = voices.find((v: any) => v.lang.includes('en-US') && v.name.includes('Google')) || 
                    voices.find((v: any) => v.lang.includes('en'));

    const callQueue = (name: string, queueNo: number, type: string) => {
        // 1. Loket Configuration
        const config: Record<string, string> = {
            'SMKHP': 'S M K H P unit,',
            'Laboratorium': 'Laboratory,',
            'Customer Service': 'Customer Service desk,'
        };

        // 2. Number Mapping (Ensuring 'zero' instead of 'nol')
        const map: Record<string, string> = {
            '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
            '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine'
        };

        // 3. Prefix Letter Mapping
        const letterMap: Record<string, string> = {
            'SMKHP': 'A',
            'Laboratorium': 'B',
            'Customer Service': 'C'
        };

        const prefixName = config[type] || 'designated unit';
        const letter = letterMap[type] || 'Number';
        
        const paddedNum = String(queueNo).padStart(3, '0');
        const spokenNumbers = paddedNum.split('').map(digit => map[digit]).join(' ');

        // 4. English Sentence Construction
        // Analisa: Gunakan "please proceed to" untuk kesan profesional
        const baseText = `Queue number, ${letter}, ${spokenNumbers}, . . . for, ${name.toLowerCase()}, . . . please proceed to ${prefixName}.`;

        // 5. 2-Second Delay (Comma strategy)
        const pause = ", , , , , , , ,"; 
        const fullText = `${baseText} ${pause} . . . once again . . . ${baseText}`;

        cancel(); 
        
        speak({
            text: fullText,
            voice: enVoice,
            rate: 0.9,
            pitch: 1.0, 
        });
    };

    return { callQueue, speaking, cancel };
};

export default useQueueCaller;