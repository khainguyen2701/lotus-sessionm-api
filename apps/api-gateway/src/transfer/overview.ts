interface InputType<T> {
  status: 'fulfilled' | 'rejected';
  value: {
    success: boolean;
    data: T;
    timestamp: string;
  };
}

export class OverviewResponse<T> {
  constructor() {}

  convert(input: InputType<T>): T | null {
    if (input?.status === 'fulfilled') {
      return input.value.data;
    }
    return null;
  }
}
