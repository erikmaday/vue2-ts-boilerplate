/* eslint-disable no-unused-vars */
export enum KeyCode {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
  Escape = 27,
  LeftArrow = 37,
  UpArrow = 38,
  RightArrow = 39,
  DownArrow = 40,
}

export enum ReservationType {
  CompanyOwned = 0,
  Referral = 1,
}

export enum ReservationStatus {
  Upcoming = 'upcoming',
  Started = 'started',
  Finished = 'finished',
  Cancelled = 'cancelled',
  Hold = 'hold',
}

export enum ReferralStatus {
  Offered = 'offered',
  Accepted = 'accepted',
  Rejected = 'rejected',
}
