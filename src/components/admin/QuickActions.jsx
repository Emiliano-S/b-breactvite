import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, FileText, Download, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  return (
    <Card>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/admin/rooms/new">
          <Button variant="outline" fullWidth size="small">
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </Link>
        <Button variant="outline" fullWidth size="small">
          <FileText className="w-4 h-4 mr-2" />
          Reports
        </Button>
        <Button variant="outline" fullWidth size="small">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
        <Link to="/admin/settings">
          <Button variant="outline" fullWidth size="small">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>
    </Card>
  );
};