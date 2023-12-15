import { Button } from "../ui/button";

export default function Header() {
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-300">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/tables"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ms-3">Tables</span>
              </a>
            </li>
            <li>
              <a
                href="/items"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ms-3">Items</span>
              </a>
            </li>
            <li>
              <a
                href="/employees"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ms-3">Employees</span>
              </a>
            </li>
          </ul>

          <Button
            variant="destructive"
            className="mt-8 w-full"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
              window.location.reload();
            }}
          >
            Log Out
          </Button>
        </div>
      </aside>
    </>
  );
}
