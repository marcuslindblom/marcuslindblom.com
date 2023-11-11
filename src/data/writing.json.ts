export interface Template {
  link: string;
  title: string;
  description: string;
  date: string;
};
const one: Template = {
  link: "/journal/starting-nimble-initiatives",
  title: "Starting Nimble Initiatives",
  description: "Back to simplicity",
  date: "10.02.2021",
};

const two: Template = {
  link: "/journal/the-first-day-of-your-life-was-the-best-day-of-mine",
  title: "Hello, world!",
  description: "The first day of your life, was the best day of mine",
  date: "10.02.2021",
};

export const bytype = {
  one,
  two
};
export const writing = Object.values(bytype);
