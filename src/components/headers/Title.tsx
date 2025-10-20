interface titleContent {
  title: string;
}

export const Title = (props: titleContent) => {
  return <h1 className="text-4xl font-bold font-medium">{props.title}</h1>;
};
