import { useState, useEffect } from "react";
import {
    Mail,
    File,
    Package,
    User,
    Search,
    CornerDownLeft,
} from "lucide-react";
import "./SearchAutocomplete.scss";

const MOCK_SEARCH_RESULTS = [
    { title: "Gmail", another: "Inbox", icon: <Mail /> },
    { title: "Google Drive", another: "My Drive", icon: <Package /> },
    { title: "Project Proposal.docx", another: "Docs", icon: <File /> },
    { title: "John Doe", another: "Contact", icon: <User /> },
    { title: "Create new draft", another: "rob@getblock.com", icon: <Mail /> },
    { title: "Meeting Notes.pdf", another: "Docs", icon: <File /> },
    { title: "Ask Google Assistant", another: null, icon: <Package /> },
    { title: "Elon Musk", another: "Contact", icon: <User /> },
    {
        title: "New lithium-ion battery",
        another: "elon@tesla.com",
        icon: <Mail />,
    },
    { title: "Team Roadmap.xlsx", another: "Sheets", icon: <File /> },
    { title: "Larry Page", another: "Contact", icon: <User /> },
    {
        title: "Re: AWS partnership",
        another: "jeff@amazon.com",
        icon: <Mail />,
    },
    { title: "Marketing Plan.pptx", another: "Slides", icon: <File /> },
    { title: "Create new draft", another: "joe@getblock.co", icon: <Mail /> },
    { title: "Zoom Meeting", another: "Calendar Event", icon: <Package /> },
    {
        title: "Reworked search algorithm",
        another: "larry@abc.xyz",
        icon: <Mail />,
    },
    { title: "Design Mockup.fig", another: "Figma", icon: <File /> },
];

export const SearchAutocomplete = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(MOCK_SEARCH_RESULTS);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [suggestion, setSuggestion] = useState("");

    useEffect(() => {
        if (!query) {
            setResults(MOCK_SEARCH_RESULTS);
            setActiveIndex(-1);
            setSuggestion("");
            return;
        }

        const handler = setTimeout(() => {
            const filtered = MOCK_SEARCH_RESULTS.filter(
                ({ title, another }) =>
                    title.toLowerCase().includes(query.toLowerCase()) ||
                    (another &&
                        another.toLowerCase().includes(query.toLowerCase()))
            );
            setResults(filtered);
            setActiveIndex(-1);
            setSuggestion(filtered[0]?.title || "");
        }, 200);

        return () => clearTimeout(handler);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(
                (prev) => (prev < results.length - 1 ? prev + 1 : 0) //
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(
                (prev) => (prev > 0 ? prev - 1 : results.length - 1) //
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && results[activeIndex]) {
                const selected = results[activeIndex];
                setQuery(selected.title);
                setResults([]);
                setActiveIndex(-1);
            }
        }
    };

    return (
        <div className="search-container" style={{ position: "relative" }}>
            <div className="search">
                <Search size="50px" color="#a2a2a2" />
                <input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {suggestion && query !== suggestion && (
                    <div className="hint">
                        {query}
                        <span>{suggestion.slice(query.length)}</span>
                    </div>
                )}
            </div>

            <div className="results">
                {results.length > 0 ? (
                    results.map(({ title, another, icon }, idx) => (
                        <div
                            className={`result ${
                                idx === activeIndex ? "active" : ""
                            }`}
                            key={idx}
                            onClick={() => {
                                setQuery(title);
                                setResults([]);
                                setActiveIndex(-1);
                            }}
                        >
                            <div className="result-info">
                                {icon}
                                <span>
                                    {title} {another ? `- ${another}` : ""}
                                </span>
                            </div>
                            <div className="enter-btn">
                                <CornerDownLeft />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">No results found</div>
                )}
            </div>
        </div>
    );
};
