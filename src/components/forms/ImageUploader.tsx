
"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useState } from "react";

interface ImageUploaderProps {
    onUploadComplete: (paths: string[]) => void;
    maxFiles?: number;
}

export default function ImageUploader({
    onUploadComplete,
    maxFiles = 8,
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const supabase = createClient();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > maxFiles) {
                alert(`Máximo ${maxFiles} imágenes permitidas.`);
                return;
            }
            setFiles((prev) => [...prev, ...newFiles]);

            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const uploadImages = async () => {
        setUploading(true);
        const paths: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error, data } = await supabase.storage
                .from("listings")
                .upload(filePath, file);

            if (error) {
                console.error("Error uploading image:", error);
                alert(`Error subiendo ${file.name}`);
                // Continue with others?
            } else if (data) {
                paths.push(data.path);
            }
        }

        setUploading(false);
        onUploadComplete(paths);
    };

    // Auto-upload when files change? No, let's have manual trigger or upload on dependency?
    // Better: Upload immediately or upon Form Submission?
    // User experience: Upload immediately to show progress, or upload all at end?
    // "Multi-subida" usually implies immediate feedback or batch.
    // I'll expose "upload" method or auto-upload.
    // Simplest: Parent calls upload? No, ImageUploader encapsulates logic.
    // I'll upload immediately on select and return paths.

    // Refactor: Upload immediately
    const handleFileSelectImmediate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setUploading(true);
        const newFiles = Array.from(e.target.files);
        const newPaths: string[] = [];
        const newPreviews: string[] = [];

        // Validations
        if (files.length + newFiles.length > maxFiles) {
            alert(`Máximo ${maxFiles} imágenes.`);
            setUploading(false);
            return;
        }

        for (const file of newFiles) {
            // Preview
            newPreviews.push(URL.createObjectURL(file));

            // Upload
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { error, data } = await supabase.storage
                .from("listings")
                .upload(fileName, file);

            if (error) {
                console.error(error);
                alert("Error subiendo imagen");
            } else {
                newPaths.push(data.path);
            }
        }

        setFiles(prev => [...prev, ...newFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
        onUploadComplete(newPaths); // In strict mode, we should append to parent state
        setUploading(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                            className="w-8 h-8 mb-4 text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click para subir</span>
                        </p> {/* Drag n drop omitted for brevity in MVP */}
                        <p className="text-xs text-gray-500">
                            SVG, PNG, JPG (Max. {maxFiles})
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelectImmediate}
                        disabled={uploading}
                    />
                </label>
            </div>

            {uploading && <p className="text-sm text-blue-500">Subiendo...</p>}

            <div className="grid grid-cols-4 gap-4">
                {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                        <img src={src} alt="Preview" className="object-cover w-full h-full" />
                        {/* Remove button could go here */}
                    </div>
                ))}
            </div>
        </div>
    );
}
