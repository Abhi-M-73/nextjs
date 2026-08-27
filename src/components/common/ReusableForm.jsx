"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ReusableForm = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    options,
    required = false,
    icon: Icon,
    className = "",
    disabled = false,
    rows = 4,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);

    const commonInputClass = `bg-transparent flex-1 outline-none text-white placeholder-white/70 text-md disabled:cursor-not-allowed ${className}`;

    const renderInput = () => {
        switch (type) {
            case "select":
                return (
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={commonInputClass}
                    >
                        <option value="" className="bg-[#101420] text-gray-400">
                            Select {label}
                        </option>
                        {options?.map((opt) => (
                            <option
                                key={opt?.value || opt}
                                value={opt?.value || opt}
                                className="bg-[#101420] text-gray-300"
                            >
                                {opt?.label || opt}
                            </option>
                        ))}
                    </select>
                );

            case "date":
                return (
                    <input
                        id={name}
                        name={name}
                        type="date"
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={`${commonInputClass} cursor-pointer [color-scheme:dark]`}
                    />
                );

            case "password":
                return (
                    <div className="flex items-center w-full">
                        <input
                            id={name}
                            name={name}
                            type={showPassword ? "text" : "password"}
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            required={required}
                            disabled={disabled}
                            className={commonInputClass}
                        />
                        <button
                            type="button"
                            onClick={handleTogglePassword}
                            className="text-gray-400 hover:text-gray-200 transition ml-2"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                );

            case "file":
                return (
                    <div className="border border-dashed border-gray-500 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
                        <input
                            id={name}
                            name={name}
                            type="file"
                            onChange={onChange}
                            required={required}
                            disabled={disabled}
                            className="text-sm text-slate-300 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--btnColor)] file:text-white hover:file:bg-[var(--btnColor)]/90 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <p className="text-[12px] text-slate-300 text-center sm:text-left">
                            Upload a screenshot or image that helps us understand better. JPG, PNG
                            supported.
                        </p>
                    </div>
                );

            case "textarea":
                return (
                    <textarea
                        id={name}
                        name={name}
                        rows={rows}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className="w-full min-h-[120px] rounded-xl  border border-slate-700 px-4 py-3 text-sm text-slate-100 placeholder:text-gray-300 focus:outline-none resize-y disabled:cursor-not-allowed"
                    />
                );

            default:
                return (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        placeholder={placeholder}
                        value={type !== "file" ? value : undefined}
                        onChange={onChange}
                        required={required}
                        disabled={disabled}
                        className={commonInputClass}
                    />
                );
        }
    };

    const isTextarea = type === "textarea";
    const isFile = type === "file";

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={name}
                    className={
                        isTextarea || isFile
                            ? "text-sm font-medium mb-1 text-gray-300 flex items-center gap-2"
                            : "block text-md font-medium mb-1 text-gray-300"
                    }
                >
                    {Icon && (isTextarea || isFile) ? (
                        <>
                            <Icon className="w-4 h-4 text-gray-300" />
                            <span>{label}</span>
                            {required && <span className="text-red-500">*</span>}
                        </>
                    ) : (
                        <>
                            {label} {required && <span className="text-red-500">*</span>}
                        </>
                    )}
                </label>
            )}

            {/* Wrapper: textarea & file use their own box, others use old flex-box */}
            <div
                className={
                    isTextarea || isFile
                        ? "group"
                        : `flex items-center gap-3 rounded-lg px-2 py-2 border !border-gray-700 group`
                }
            >
                {Icon && !isTextarea && !isFile && (
                    <div className="bg-[#252525] p-2 rounded">
                        <Icon className="w-5 h-5 text-gray-300 group-focus-within:text-[var(--btnColor)]" />
                    </div>
                )}

                {renderInput()}
            </div>
        </div>
    );
};

export default ReusableForm;