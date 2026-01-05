import type { NumberFormatOptions } from '@/common/types/common';

export class NumberFormat {
  private decimal = '.';
  private precision: number = 3;
  private separator: string = ' ';
  private max = Number.MAX_SAFE_INTEGER;
  private min = Number.MIN_SAFE_INTEGER;
  private operation: 'floor' | 'ceil' | 'round' = 'floor';
  private maxValueInclusive: boolean = true;
  private minValueInclusive: boolean = true;
  private autoCorrect: boolean = true;
  private prefix: string = '';
  private suffix: string = '';

  constructor(options?: NumberFormatOptions) {
    if (typeof options?.precision == 'number') this.precision = options.precision;

    if (typeof options?.autoCorrect === 'boolean') this.autoCorrect = options.autoCorrect;

    if (typeof options?.max === 'number')
      this.max = this.toNumber(this.toReadable(options.max));
    if (typeof options?.min === 'number')
      this.min = this.toNumber(this.toReadable(options.min));

    if (this.max < this.min) this.max = this.min;

    if (options?.prefix) this.prefix = options.prefix;
    if (options?.suffix) this.suffix = options.suffix;
  }

  getOptions(): NumberFormatOptions {
    return {
      max: this.max,
      min: this.min,
      autoCorrect: this.autoCorrect,
      minimumFractionDigits: this.precision,
      minValueInclusive: this.minValueInclusive,
      maxValueInclusive: this.maxValueInclusive,
      separator: this.separator,
      precision: this.precision,
      decimal: this.decimal,
    };
  }

  getPositiveMin() {
    return Math.pow(10, -this.precision);
  }

  round(num: number, operation: 'floor' | 'ceil' | 'round' = 'round'): number {
    num = Number(num.toFixed(this.precision + 1));
    let result = 0;

    const factor = 10 ** this.precision;

    switch (operation) {
      case 'floor':
        result = Number((Math.floor(num * factor) / factor).toFixed(this.precision));
        break;
      case 'ceil':
        result = Number((Math.ceil(num * factor) / factor).toFixed(this.precision));
        break;
      case 'round':
        result = Number((Math.round(num * factor) / factor).toFixed(this.precision));
        break;
      default:
        throw new Error('Invalid operation. Use "floor", "ceil", or "round".');
    }

    if (this.autoCorrect && this.maxValueInclusive && result > this.max)
      result = this.max;

    return result;
  }

  toNumber(x: string | undefined | null | number): number {
    if (x === undefined || x === null || x === '' || x == '-') return 0;

    return Number(x.toString().replace(/[^\d.-]/g, ''));
  }

  toReadable(
    x: string | null | number | undefined | Number | String,
    autoCorrect?: boolean,
  ): string {
    autoCorrect = autoCorrect ?? this.autoCorrect;
    // if x is undefined | null | '', there is no need to format it
    if (x === undefined || x === null || x === '') return '';

    // removing characters from input
    const pureString = String(x).replace(/[^\d.-]/g, '');

    const sign = pureString[0] === '-' ? '-' : '';

    // find characters after digit
    const parts = pureString.split('.');
    let numbersAfterDigit = '';
    if (parts.length === 2) numbersAfterDigit = parts[1] as string;
    // split parts into groups
    const formatArrays = Intl.NumberFormat('us-US', {
      currency: 'USD',
      style: 'currency',
      useGrouping: true,
      maximumFractionDigits: this.precision,
    }).formatToParts(Number(pureString));

    // putting groups together
    let formattedString = '';
    formatArrays.forEach(part => {
      switch (part.type) {
        case 'integer': {
          formattedString += part.value;
          break;
        }
        case 'group': {
          formattedString += ' ';
          break;
        }
        case 'decimal': {
          if (parts.length === 2) formattedString += '.';
          break;
        }
        case 'fraction': {
          if (numbersAfterDigit.length < this.precision)
            formattedString += numbersAfterDigit;
          else formattedString += numbersAfterDigit.substring(0, this.precision);
          break;
        }

        default:
          break;
      }
    });

    let result = sign + formattedString;

    if (autoCorrect && this.maxValueInclusive && this.toNumber(result) > this.max)
      result = this.toReadable(this.max);

    // if (
    //   autoCorrect &&
    //   this.minValueInclusive &&
    //   this.toNumber(result) < this.min
    // )
    //   result = this.toReadable(this.min);

    return result;
  }

  withCurrency(amount: string | null | number | undefined | Number | String) {
    return this.prefix + (this.toReadable(amount) || 0) + this.suffix;
  }
}

export class MeasureFormat extends NumberFormat {
  constructor(measure_id: string, options?: NumberFormatOptions) {
    const default_options: NumberFormatOptions = {
      decimal: '.',
      separator: ' ',
      prefix: '',
      suffix: '',
      precision: 4,
      nullValue: '',
      masked: false,
      reverseFill: false,
      minimumFractionDigits: 0,
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      minValueInclusive: true,
      maxValueInclusive: true,
    };

    if (options) {
      Object.keys(options).forEach(key => {
        const k = key as keyof NumberFormatOptions;
        if (options[k] !== undefined) default_options[k] = options[k] as any;
      });
    }

    super(default_options);
  }
}
