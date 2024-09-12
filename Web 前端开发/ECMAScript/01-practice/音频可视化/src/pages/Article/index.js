import { useParams } from "react-router-dom";

export default function Article() {
  const params = useParams();

  console.log(params.id);
  console.log(params.name);

  return <div>Article</div>;
}
