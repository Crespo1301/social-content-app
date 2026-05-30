"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { accountTypeOptions, categoryOptions, platformOptions, statusOptions } from "@/lib/options";
import { SocialPost, SocialPostInput } from "@/lib/types";
import { joinCsv, splitCsv } from "@/lib/utils";

type ComposerSheetProps = {
  draft: SocialPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: SocialPostInput, id?: string) => Promise<void>;
  defaultCity?: string;
  defaultAccountType?: SocialPostInput["accountType"];
};

export function ComposerSheet({
  draft,
  isOpen,
  onClose,
  onSave,
  defaultCity,
  defaultAccountType,
}: ComposerSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const [entered, setEntered] = useState(false);

  // Esc-to-close.
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while the sheet is open; restore on close/unmount. SSR-safe.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Move focus into the sheet on open, then trigger the slide-up entrance.
  // The panel unmounts on close (returns null below), so `entered` resets to
  // false naturally on the next open — no synchronous reset needed here.
  useEffect(() => {
    if (!isOpen) return;
    (captionRef.current ?? panelRef.current)?.focus();
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const initial: SocialPostInput = draft
    ? {
        date: draft.date,
        accountType: draft.accountType,
        platform: draft.platform,
        status: draft.status,
        category: draft.category,
        campaign: draft.campaign,
        city: draft.city,
        mediaReferences: draft.mediaReferences,
        crossPostedTo: draft.crossPostedTo,
        tags: draft.tags,
        caption: draft.caption,
        notes: draft.notes,
      }
    : {
        date: new Date().toISOString().slice(0, 10),
        accountType: defaultAccountType || "business",
        platform: "Instagram",
        status: "drafted",
        category: "promotion",
        campaign: "",
        city: defaultCity || "",
        mediaReferences: [],
        crossPostedTo: [],
        tags: [],
        caption: "",
        notes: "",
      };

  async function handleSubmit(formData: FormData) {
    const payload: SocialPostInput = {
      date: String(formData.get("date") || ""),
      accountType: String(formData.get("accountType") || "business") as SocialPostInput["accountType"],
      platform: String(formData.get("platform") || "Instagram") as SocialPostInput["platform"],
      status: String(formData.get("status") || "drafted") as SocialPostInput["status"],
      category: String(formData.get("category") || "promotion") as SocialPostInput["category"],
      campaign: String(formData.get("campaign") || ""),
      city: String(formData.get("city") || ""),
      mediaReferences: splitCsv(String(formData.get("mediaReferences") || "")),
      crossPostedTo: splitCsv(String(formData.get("crossPostedTo") || "")),
      tags: splitCsv(String(formData.get("tags") || "")),
      caption: String(formData.get("caption") || ""),
      notes: String(formData.get("notes") || ""),
    };
    await onSave(payload, draft?.id);
  }

  return (
    <>
      <button type="button" aria-label="Close" onClick={onClose} className="sheet-backdrop cursor-default" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`safe-bottom fixed inset-x-0 bottom-0 z-[70] mx-auto flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-[var(--line)] bg-[var(--card)] shadow-[0_-12px_50px_var(--shadow-strong)] outline-none transition-transform duration-300 ease-out sm:bottom-6 sm:max-h-[88vh] sm:rounded-[28px] ${
          entered ? "translate-y-0" : "translate-y-full sm:translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
          <button type="button" onClick={onClose} className="text-sm font-semibold text-[var(--soft-ink)]">
            Cancel
          </button>
          <h2 id={titleId} className="text-base font-bold text-[var(--ink)]">
            {draft ? "Edit caption" : "New caption"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="vault-icon-button h-9 w-9">
            <X size={17} />
          </button>
        </div>

        <form action={handleSubmit} className="flex-1 overflow-auto px-5 py-5">
          <TextAreaField
            label="Caption"
            name="caption"
            defaultValue={initial.caption}
            rows={7}
            placeholder="Write or paste the full caption here..."
            textareaRef={captionRef}
          />

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Date" name="date" type="date" defaultValue={initial.date} />
            <Field label="Campaign" name="campaign" defaultValue={initial.campaign} placeholder="Spring client launch" />
            <SelectField label="Account type" name="accountType" options={accountTypeOptions} defaultValue={initial.accountType} />
            <SelectField label="Platform" name="platform" options={platformOptions} defaultValue={initial.platform} />
            <SelectField label="Status" name="status" options={statusOptions} defaultValue={initial.status} />
            <SelectField label="Category" name="category" options={categoryOptions} defaultValue={initial.category} />
            <Field label="City" name="city" defaultValue={initial.city} placeholder="Boston" />
            <Field label="Tags" name="tags" defaultValue={joinCsv(initial.tags)} placeholder="launch, local, content" />
            <Field label="Media references" name="mediaReferences" defaultValue={joinCsv(initial.mediaReferences)} placeholder="reel.mp4, image-1.jpg" />
            <Field label="Cross-posted to" name="crossPostedTo" defaultValue={joinCsv(initial.crossPostedTo)} placeholder="Facebook, LinkedIn" />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Notes"
              name="notes"
              defaultValue={initial.notes}
              rows={3}
              placeholder="Internal notes, CTA reminder, or media directions"
            />
          </div>

          <div className="sticky bottom-0 -mx-5 mt-5 flex gap-3 border-t border-[var(--line)] bg-[var(--card)] px-5 pt-4">
            <button type="button" onClick={onClose} className="vault-action flex-1">
              Cancel
            </button>
            <button type="submit" className="vault-action vault-action-primary flex-1">
              {draft ? "Save changes" : "Create post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <input className="vault-input" type={type} name={name} defaultValue={defaultValue} placeholder={placeholder} />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: readonly string[];
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <select className="vault-input capitalize" name={name} defaultValue={defaultValue}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows,
  placeholder,
  textareaRef,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
  placeholder?: string;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <textarea
        ref={textareaRef}
        className="vault-input min-h-[120px] resize-y"
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
      />
    </label>
  );
}
