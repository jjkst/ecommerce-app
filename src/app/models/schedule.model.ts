export interface Schedule {
    Id?: number;
    ContactName: string;
    Service: string;
    SelectedDate: Date;
    Timeslots: string[];
    Note?: string;
    Uid: string;
  }