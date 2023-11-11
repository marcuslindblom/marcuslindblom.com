export interface Template {
  link: string;
  type: string;
  title: string;
};
const one: Template = {
  link: "mailto:m@marcuslindblom.com",
  type: "Email",
  title: "m@marcuslindblom.com",
};
const two: Template = {
link: "https://twitter.com/marcus_lindblom",
    type: "X",
  title: "marcus_lindblom",
};
const three: Template = {
link: "https://read.cv/join/marcuslindblom",
    type: "Read CV",
  title: "marcuslindblom",
};
export const bytype = {
  one,
    two,
    three,
};
export const contact = Object.values(bytype);
