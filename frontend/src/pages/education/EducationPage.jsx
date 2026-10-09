import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Link2Off,
  KeyRound,
  Building2,
  Briefcase,
  TrendingUp,
  Package,
  Headphones,
  Users,
  Lock,
  Clock,
  ArrowRight,
  Search
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { EDUCATION_TOPICS } from '../../data/education';
import './Education.css';

const ICON_MAP = {
  ShieldAlert,
  Link2Off,
  KeyRound,
  Building2,
  Briefcase,
  TrendingUp,
  Package,
  Headphones,
  Users,
  Lock
};

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = EDUCATION_TOPICS.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q);
  });

  return (
    <div className="education-page">
      {/* Hero Header */}
      <div className="education-header">
        <h1 className="education-title">Security education</h1>
        <p className="education-subtitle">
          Plain-language defensive guides to recognize modern scam patterns and protect your accounts.
        </p>
      </div>

      {/* Search Input */}
      <div className="education-search-bar">
        <Input
          name="edu-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scam topics (e.g. OTP, fake jobs, delivery, banking)…"
          prefixIcon={<Search size={18} />}
        />
      </div>

      {/* Topics Grid (3-col >= 1024, 2-col >= 600, 1-col mobile) */}
      <div className="education-topics-grid">
        {filteredTopics.map((topic) => {
          const IconComp = ICON_MAP[topic.icon] || ShieldAlert;
          return (
            <Link
              key={topic.slug}
              to={`/education/${topic.slug}`}
              className="education-topic-card-link"
            >
              <Card padding="lg" className="education-topic-card">
                <div className="education-topic-top">
                  <div className="education-topic-icon">
                    <IconComp size={22} />
                  </div>
                  <span className="education-topic-time">
                    <Clock size={12} />
                    <span>{topic.readTime}</span>
                  </span>
                </div>

                <h3 className="education-topic-title">
                  {topic.title}
                </h3>

                <p className="education-topic-summary">
                  {topic.summary}
                </p>

                <div className="education-topic-action">
                  <span>Read guide</span>
                  <ArrowRight size={16} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
