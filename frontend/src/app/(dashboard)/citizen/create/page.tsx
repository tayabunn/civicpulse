'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateIssueMutation, useGetIssuesQuery } from '@/store/apiSlice';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageUploader } from '@/components/ui/image-uploader';
import { LocationPicker } from '@/components/map/location-picker';
import { calculateDistanceMeters } from '@/lib/geo-client';
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { IssueCategory, IssuePriority, Issue } from '@/types';

export default function CreateIssuePage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [createIssue, { isLoading: isSubmitting }] = useCreateIssueMutation();
  const { data: existingIssuesData } = useGetIssuesQuery({ limit: 100 });

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory>('road_damage');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Mirpur Road, Dhanmondi, Dhaka');
  const [latitude, setLatitude] = useState(23.8103);
  const [longitude, setLongitude] = useState(90.4125);
  const [imageUrl, setImageUrl] = useState('');

  // Validation & Touched state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Field validation rules
  const errors = {
    title: !title.trim()
      ? 'Title is required'
      : title.trim().length < 5
      ? 'Title must be at least 5 characters'
      : null,
    description: !description.trim()
      ? 'Detailed description is required'
      : description.trim().length < 15
      ? 'Description must be at least 15 characters to assist repair crews'
      : null,
    address: !address.trim()
      ? 'Street address is required'
      : address.trim().length < 5
      ? 'Address must be at least 5 characters'
      : null,
    location:
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
        ? 'Valid GPS coordinates are required'
        : null,
  };

  const isFormValid = !errors.title && !errors.description && !errors.address && !errors.location;

  // 50m Proximity Radar Duplicate Detection
  const nearbyDuplicates = (existingIssuesData?.items || []).filter((issue: Issue) => {
    const dist = calculateDistanceMeters(latitude, longitude, issue.latitude, issue.longitude);
    return dist <= 50;
  });

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!isFormValid) {
      setErrorMsg('Please resolve the highlighted validation errors before submitting.');
      return;
    }

    try {
      const res = await createIssue({
        title: title.trim(),
        category,
        priority,
        description: description.trim(),
        address: address.trim(),
        latitude,
        longitude,
        imageUrl: imageUrl || undefined,
        reporterId: user?.id,
      }).unwrap();

      setSuccessMsg(`Incident reported successfully! Tracking code: ${res.trackingCode}`);
      setTimeout(() => {
        router.push(`/citizen/issues/${res.id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.data?.error || 'Failed to submit report. Please check your network and input.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-text-primary tracking-tight">
            Report Municipal Infrastructure Issue
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            Submit geotagged infrastructure defects directly to Dhaka City Corporation triage dispatchers.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 animate-fadeIn">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Details */}
          <Card className="p-6 space-y-4">
            <CardHeader className="p-0">
              <CardTitle>1. Incident Information</CardTitle>
              <CardDescription>Describe what needs repair or attention</CardDescription>
            </CardHeader>

            <div>
              <Input
                label="Incident Title *"
                id="title"
                placeholder="e.g. Hazardous deep pothole near Dhanmondi 27"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                onBlur={() => markTouched('title')}
                className={(touched.title || submitted) && errors.title ? 'border-rose-500 focus:ring-rose-500' : ''}
                required
              />
              {(touched.title || submitted) && errors.title && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.title}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Sector / Category *"
                id="category"
                value={category}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as IssueCategory)}
                options={[
                  { label: 'Road Damage (Pothole/Cracks)', value: 'road_damage' },
                  { label: 'Faulty Streetlight', value: 'streetlight' },
                  { label: 'Drainage & Sewage Overflow', value: 'drainage' },
                  { label: 'Damaged Footpath / Walkway', value: 'footpath' },
                  { label: 'Waste Management & Trash Dump', value: 'waste_management' },
                  { label: 'Public Infrastructure', value: 'public_infrastructure' },
                ]}
              />

              <Select
                label="Perceived Severity"
                id="priority"
                value={priority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as IssuePriority)}
                options={[
                  { label: 'Low (Minor cosmetic)', value: 'low' },
                  { label: 'Medium (Standard maintenance)', value: 'medium' },
                  { label: 'High (Impeding traffic)', value: 'high' },
                  { label: 'Critical (Severe safety hazard)', value: 'critical' },
                ]}
              />
            </div>

            <div>
              <Textarea
                label="Detailed Description *"
                id="description"
                placeholder="Provide exact details (e.g. depth of pothole, sparking wire, waterlogged street)..."
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                onBlur={() => markTouched('description')}
                rows={4}
                className={(touched.description || submitted) && errors.description ? 'border-rose-500 focus:ring-rose-500' : ''}
                required
              />
              {(touched.description || submitted) && errors.description && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.description}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Street Address / Landmark *"
                id="address"
                placeholder="e.g. Road 27, House 42, Dhanmondi, Dhaka"
                value={address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                onBlur={() => markTouched('address')}
                className={(touched.address || submitted) && errors.address ? 'border-rose-500 focus:ring-rose-500' : ''}
                required
              />
              {(touched.address || submitted) && errors.address && (
                <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.address}
                </p>
              )}
            </div>

            {/* Photograph Evidence Dropzone & Preview */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary">
                Photograph Evidence (Drag-and-Drop or Sample)
              </label>
              <ImageUploader value={imageUrl} onChange={setImageUrl} maxSizeMB={5} />
            </div>
          </Card>

          {/* Right Column: Geolocation & Duplicate Radar */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4">
              <CardHeader className="p-0">
                <CardTitle>2. Geolocation Pinpoint</CardTitle>
                <CardDescription>Precision GPS coordinates for field crews</CardDescription>
              </CardHeader>

              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onChange={(lat: number, lon: number) => {
                  setLatitude(lat);
                  setLongitude(lon);
                }}
              />
            </Card>

            {/* 50m Proximity Radar Alert */}
            {nearbyDuplicates.length > 0 && (
              <Card className="p-4 border-2 border-brand-yellow bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm">
                      Nearby Existing Issue Detected ({nearbyDuplicates.length} within 50m)
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      An incident has already been reported within 50 meters of your selected pin:
                    </p>
                    <div className="p-2.5 rounded bg-white/80 dark:bg-black/30 border border-amber-200 dark:border-amber-800 text-xs">
                      <span className="font-mono font-bold">{nearbyDuplicates[0].trackingCode}: </span>
                      <span className="font-semibold">{nearbyDuplicates[0].title}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{nearbyDuplicates[0].address}</p>
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
                      You can still submit if this is a distinct problem, or view the existing issue to follow its progress.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Form Submission Controls */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            isLoading={isSubmitting}
            className="font-bold px-8 shadow-md"
          >
            Submit Incident Report
          </Button>
        </div>
      </form>
    </div>
  );
}
