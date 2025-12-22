import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    transform(isoDuration: string): any {
        if (!isoDuration) {
            return '';
        }

        // Regex to parse ISO 8601 duration parts
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+\.?\d*)S)?/;
        const matches = isoDuration.match(regex);
        if (!matches) {
            return isoDuration; // fallback to original if no match
        }

        const hours = parseInt(matches[1] || '0', 10);
        const minutes = parseInt(matches[2] || '0', 10);
        const secondsFloat = parseFloat(matches[3] || '0');
        const seconds = Math.floor(secondsFloat);

        const hh = hours.toString().padStart(2, '0');
        const mm = minutes.toString().padStart(2, '0');
        const ss = seconds.toString().padStart(2, '0');

        if(hours == 0) {
            return `${mm}:${ss}`
        }

        return `${hh}:${mm}:${ss}`;
    }

    //format hh:mm to iso format
    public static toIsoFormat(duration: string | null) {
        if(!duration) return null;

        const [h, m] = duration.split(':').map(Number);
        return `PT${h ? h + 'H' : ''}${m ? m + 'M' : ''}`;
    }

    public static fromSeconds(seconds: number) {
        const minutes = Math.floor(seconds / 60);

        const mm = minutes.toString().padStart(2, '0');
        const ss = (seconds % 60).toString().padStart(2, '0');

        return `${mm}:${ss}`;
    }
}