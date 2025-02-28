import LinkList from "./linkList";

export default function NavBar({ children }: { children: React.ReactNode }) {
  return (
    <header>
      <nav>
        <LinkList />
      </nav>

      {children}
    </header>
  );
}
