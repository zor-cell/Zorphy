import {Component, forwardRef, input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-slider-checkbox',
    imports: [],
    templateUrl: './slider-checkbox.component.html',
    
    styleUrl: './slider-checkbox.component.css',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderCheckboxComponent),
            multi: true
        }
    ]
})
export class SliderCheckboxComponent implements ControlValueAccessor {
    public unCheckedText = input('F');
    public checkedText = input('T');

    protected isChecked: boolean = false;
    private onChange: (value: boolean) => void = () => {};

    protected get label() {
        const label = this.isChecked ? this.checkedText() : this.unCheckedText();
        return '"' + label + '"';
    }

    public writeValue(value: boolean): void {
        this.isChecked = value;
    }

    public registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        //throw new Error('Method not implemented.');
    }

    public setDisabledState?(isDisabled: boolean): void {
        //throw new Error('Method not implemented.');
    }

    protected updateChecked(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        this.isChecked = checkbox.checked;

        this.onChange(this.isChecked);
    }
}
