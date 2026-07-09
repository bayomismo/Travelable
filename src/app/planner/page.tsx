'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Sparkles,
  Plane,
  BedDouble,
  Utensils,
  Car,
  Ticket,
  ShieldAlert,
  Lightbulb,
  CalendarDays,
  Hotel,
  Armchair,
  Crown,
  TrendingDown,
  Loader2,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Snowflake,
  MapPin,
  Clock,
  Footprints,
  DollarSign,
  Coffee,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';

interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  cost: number;
  type: 'food' | 'activity' | 'transport' | 'sightseeing' | 'rest';
  tips?: string;
}

interface Day {
  day: number;
  date: string;
  title: string;
  morning: Activity[];
  afternoon: Activity[];
  evening: Activity[];
  weather: { temp: number; condition: string; icon: string };
  estimatedCost: number;
  walkingDistance: number;
}

const WEATHER_ICON: Record<string, React.ElementType> = {
  sun: Sun,
  'cloud-sun': Cloud,
  cloud: Cloud,
  'cloud-rain': CloudRain,
  'cloud-drizzle': CloudRain,
  'cloud-snow': Snowflake,
  wind: Wind,
  smog: Wind,
};

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  food: Coffee,
  sightseeing: Camera,
  transport: Car,
  activity: Ticket,
  rest: Coffee,
};

export default function PlannerPage() {
  // Budget state
  const [budgetForm, setBudgetForm] = useState({
    totalBudget: 3000,
    days: 7,
    travelers: 2,
    destination: '',
    style: 'comfort',
  });
  const [budget, setBudget] = useState<any | null>(null);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [budgetLoading, setBudgetLoading] = useState(false);

  // Itinerary state
  const [itineraryForm, setItineraryForm] = useState({
    destination: '',
    days: 5,
    budget: 3000,
    travelers: 2,
    style: 'balanced',
  });
  const [itinerary, setItinerary] = useState<Day[]>([]);
  const [itineraryLoading, setItineraryLoading] = useState(false);

  const handleBudget = async () => {
    setBudgetLoading(true);
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetForm),
      });
      const data = await res.json();
      setBudget(data.breakdown);
      setOptimizations(data.optimizations ?? []);
    } catch {
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleItinerary = async () => {
    setItineraryLoading(true);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itineraryForm),
      });
      const data = await res.json();
      setItinerary(data.days ?? []);
    } catch {
    } finally {
      setItineraryLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5 text-accent-brand" />
              AI Planner
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Plan your perfect trip in 60 seconds</h1>
            <p className="text-muted-foreground">
              Tell us where you're going and what you can spend. We'll build the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget planner */}
            <div className="bg-card border rounded-2xl shadow-card overflow-hidden">
              <div className="p-5 border-b flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Budget optimizer</h2>
                  <p className="text-xs text-muted-foreground">Allocate every dollar</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <Label className="text-xs mb-1.5 block">Total budget</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={budgetForm.totalBudget}
                        onChange={(e) => setBudgetForm({ ...budgetForm, totalBudget: Number(e.target.value) })}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Days</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={budgetForm.days}
                      onChange={(e) => setBudgetForm({ ...budgetForm, days: Number(e.target.value) })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Travelers</Label>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={budgetForm.travelers}
                      onChange={(e) => setBudgetForm({ ...budgetForm, travelers: Number(e.target.value) })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-1.5 block">Destination</Label>
                  <Input
                    value={budgetForm.destination}
                    onChange={(e) => setBudgetForm({ ...budgetForm, destination: e.target.value })}
                    placeholder="e.g., Tokyo, Japan"
                    className="h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs mb-1.5 block">Travel style</Label>
                  <Select value={budgetForm.style} onValueChange={(v) => setBudgetForm({ ...budgetForm, style: v })}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">
                        <span className="flex items-center gap-2"><TrendingDown className="h-3.5 w-3.5" /> Budget</span>
                      </SelectItem>
                      <SelectItem value="comfort">Comfort</SelectItem>
                      <SelectItem value="luxury">
                        <span className="flex items-center gap-2"><Crown className="h-3.5 w-3.5" /> Luxury</span>
                      </SelectItem>
                      <SelectItem value="ultra-luxury">Ultra-luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleBudget}
                  disabled={budgetLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {budgetLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Optimizing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Optimize budget
                    </>
                  )}
                </Button>
              </div>

              {/* Budget results */}
              <AnimatePresence>
                {(budget || budgetLoading) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t bg-surface"
                  >
                    <div className="p-5">
                      {budgetLoading ? (
                        <div className="space-y-3">
                          <Skeleton className="h-32 rounded-xl" />
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
                          </div>
                        </div>
                      ) : budget && (
                        <>
                          <div className="text-center mb-3">
                            <p className="text-3xl font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget.total)}</p>
                            <p className="text-xs text-muted-foreground">Total budget</p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { key: 'flights', label: 'Flights', icon: Plane, color: 'text-primary' },
                              { key: 'accommodation', label: 'Hotels', icon: BedDouble, color: 'text-emerald-600' },
                              { key: 'food', label: 'Food', icon: Utensils, color: 'text-amber-600' },
                              { key: 'transport', label: 'Transport', icon: Car, color: 'text-rose-500' },
                              { key: 'activities', label: 'Activities', icon: Ticket, color: 'text-violet-600' },
                              { key: 'emergency', label: 'Buffer', icon: ShieldAlert, color: 'text-muted-foreground' },
                            ].map((cat) => {
                              const Icon = cat.icon;
                              const v = budget[cat.key]?.allocated ?? 0;
                              return (
                                <div key={cat.key} className="bg-card rounded-lg border p-3">
                                  <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
                                  <p className="text-xs text-muted-foreground mt-1">{cat.label}</p>
                                  <p className="font-semibold">${v.toLocaleString()}</p>
                                </div>
                              );
                            })}
                          </div>

                          {budget.tips?.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                                <Lightbulb className="h-4 w-4 text-amber" /> AI tips
                              </h4>
                              <ul className="space-y-1.5 text-xs text-muted-foreground">
                                {budget.tips.slice(0, 4).map((tip: string, i: number) => (
                                  <li key={i} className="flex items-start gap-1.5">
                                    <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Itinerary planner */}
            <div className="bg-card border rounded-2xl shadow-card overflow-hidden">
              <div className="p-5 border-b flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-accent-brand/15 text-accent-brand flex items-center justify-center">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Itinerary builder</h2>
                  <p className="text-xs text-muted-foreground">Day-by-day with restaurants & activities</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="text-xs mb-1.5 block">Destination</Label>
                  <Input
                    value={itineraryForm.destination}
                    onChange={(e) => setItineraryForm({ ...itineraryForm, destination: e.target.value })}
                    placeholder="e.g., Kyoto, Japan"
                    className="h-10"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5 block">Days</Label>
                    <Input
                      type="number"
                      min={1}
                      max={14}
                      value={itineraryForm.days}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, days: Number(e.target.value) })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Travelers</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={itineraryForm.travelers}
                      onChange={(e) => setItineraryForm({ ...itineraryForm, travelers: Number(e.target.value) })}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5 block">Budget</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={itineraryForm.budget}
                        onChange={(e) => setItineraryForm({ ...itineraryForm, budget: Number(e.target.value) })}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleItinerary}
                  disabled={itineraryLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {itineraryLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Building itinerary…
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Build itinerary
                    </>
                  )}
                </Button>
              </div>

              {/* Itinerary results */}
              <AnimatePresence>
                {(itinerary.length > 0 || itineraryLoading) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t bg-surface max-h-[600px] overflow-y-auto"
                  >
                    <div className="p-5 space-y-3">
                      {itineraryLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
                      ) : (
                        itinerary.map((day) => (
                          <DayCard key={day.day} day={day} />
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DayCard({ day }: { day: Day }) {
  const Weather = WEATHER_ICON[day.weather.icon] ?? Sun;
  const allActivities = [...day.morning, ...day.afternoon, ...day.evening];

  return (
    <div className="bg-card rounded-xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Day {day.day} · {day.date}</p>
          <h3 className="font-semibold text-sm">{day.title}</h3>
        </div>
        <Badge variant="outline" className="rounded-full text-xs gap-1.5">
          <Weather className="h-3 w-3 text-amber" />
          {day.weather.temp}°C
        </Badge>
      </div>
      <ul className="space-y-1.5">
        {allActivities.slice(0, 6).map((act, i) => {
          const Icon = ACTIVITY_ICON[act.type] ?? Ticket;
          return (
            <li key={i} className="flex items-start gap-2 text-xs">
              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-foreground/90 font-medium truncate">{act.name}</p>
                <p className="text-muted-foreground text-[11px] flex items-center gap-2">
                  <span>{act.time}</span>
                  {act.location && <span className="truncate">· {act.location}</span>}
                  {act.cost > 0 && <span>· ${act.cost}</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> ~${day.estimatedCost}</span>
        <span className="flex items-center gap-1"><Footprints className="h-3.5 w-3.5" /> {day.walkingDistance}km</span>
      </div>
    </div>
  );
}