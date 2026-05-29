"use client";

import { X } from "lucide-react";
import { accountTypeOptions, categoryOptions, platformOptions, statusOptions } from "@/lib/options";
import { SocialPost, SocialPostInput } from "@/lib/types";
import { joinCsv, splitCsv } from "@/lib/utils";

type PostFormDialogProps = {
  draft: SocialPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: SocialPostInput, id?: string) => Promise<void>;
};

export function PostFormDialog({
  draft,
  isOpen,
  onClose,
  onSave,
}: PostFormDialogProps) {
  if (!isOpen) {
    return null;
  }

  const initialValues: SocialPostInput = draft
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
        accountType: "business",
        platform: "Instagram",
        status: "drafted",
        category: "promotion",
        campaign: "",
        city: "",
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
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px]">
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-end justify-center px-4 py-4 sm:items-center sm:px-6 lg:px-8">
        <div className="max-h-[92vh] w-full overflow-auto rounded-[28px] bg-white shadow-[0_28px_80px_rgba(19,38,74,0.24)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--line)] bg-white px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {draft ? "Edit caption" : "New caption"}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--ink)]">
                {draft ? "Update your saved post" : "Save a new social post"}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="vault-icon-button">
              <X size={18} />
            </button>
          </div>

          <form action={handleSubmit} className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" name="date" type="date" defaultValue={initialValues.date} />
              <Field label="Campaign" name="campaign" defaultValue={initialValues.campaign} placeholder="Spring client launch" />
              <SelectField label="Account type" name="accountType" options={accountTypeOptions} defaultValue={initialValues.accountType} />
              <SelectField label="Platform" name="platform" options={platformOptions} defaultValue={initialValues.platform} />
              <SelectField label="Status" name="status" options={statusOptions} defaultValue={initialValues.status} />
              <SelectField label="Category" name="category" options={categoryOptions} defaultValue={initialValues.category} />
              <Field label="City" name="city" defaultValue={initialValues.city} placeholder="Boston" />
              <Field label="Tags" name="tags" defaultValue={joinCsv(initialValues.tags)} placeholder="launch, local, content" />
              <Field label="Media references" name="mediaReferences" defaultValue={joinCsv(initialValues.mediaReferences)} placeholder="reel.mp4, image-1.jpg" />
              <Field label="Cross-posted to" name="crossPostedTo" defaultValue={joinCsv(initialValues.crossPostedTo)} placeholder="Facebook, LinkedIn" />
            </div>

            <TextAreaField
              label="Caption"
              name="caption"
              defaultValue={initialValues.caption}
              rows={7}
              placeholder="Write or paste the full caption here..."
            />

            <TextAreaField
              label="Notes"
              name="notes"
              defaultValue={initialValues.notes}
              rows={4}
              placeholder="Internal notes, usage context, CTA reminder, or media directions"
            />

            <div className="flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="vault-action justify-center">
                Cancel
              </button>
              <button type="submit" className="vault-action vault-action-primary justify-center">
                {draft ? "Save changes" : "Create post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <input
        className="vault-input"
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
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
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <select className="vault-input" name={name} defaultValue={defaultValue}>
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows: number;
  placeholder?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
      <textarea
        className="vault-input min-h-[140px] resize-y"
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
      />
    </label>
  );
}
