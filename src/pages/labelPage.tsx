import { Search } from "lucide-react";
import { useState,useRef } from "react";

function LabelPage() {
    
    const [label, setLabel] = useState<string | null>(null)
    const labelInputRef = useRef<HTMLInputElement | null>(null);
    void label;
    
    const saveLabel = () => {
        const labeling = labelInputRef.current?.value.trim()
        if (!labeling) {
            alert("enter label");
            return
        }
        setLabel(labeling)
    }

    return (
        <>
            <div className="flex justify-center items-start mt-10">
                <div className="w-full max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 m-4">

                    <h1 className="text-sm font-medium text-gray-800 mb-3">Label note</h1>

                    <div className="relative mb-4">
                        <input
                            ref={labelInputRef}
                            type="text"
                            placeholder="Enter label name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 transition-colors">
                            <Search size={16} />
                        </button>
                    </div>

                    <div className="flex justify-end gap-2">
                        
                        <button
                            onClick={saveLabel}
                            className="px-6 py-2 text-sm font-medium rounded text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            done
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default LabelPage