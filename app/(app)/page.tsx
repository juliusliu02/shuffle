import NewArticleForm from "@/components/new-article-form";
import { PageTitle } from "@/components/typography";

export default function Home() {
  return (
    <div className="mt-32 mx-auto max-w-2xl px-10 flex flex-col">
      <PageTitle className="mb-8">Add a new article</PageTitle>
      <div>
        <NewArticleForm />
      </div>
    </div>
  );
}
