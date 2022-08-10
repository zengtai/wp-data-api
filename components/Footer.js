export default function Footer(params) {
  return (
    <>
      <footer className="bg-slate-700 text-sm text-slate-500">
        <div className="container mx-auto py-10">
          <p className="mx-4">
            Copyright &copy; {new Date().getFullYear()} Recipe Guru. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
