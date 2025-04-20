import NewArticleForm from "@/components/article/new-article-form";
import { PageTitle } from "@/components/typography";

export default function Home() {
  return (
    <div className="m-auto w-full max-w-3xl px-10 flex flex-col justify-around">
      <PageTitle className="mb-10 text-center">
        Add an article to start annotation.
      </PageTitle>
      <NewArticleForm />
    </div>
  );
}
