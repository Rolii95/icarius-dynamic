import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/resources/white-paper",
    permanent: true,
  },
});

export default function WhitepaperRedirect() {
  return null;
}
