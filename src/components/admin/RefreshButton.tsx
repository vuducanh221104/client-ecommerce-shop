import React from 'react';
import { Button, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
  tooltip?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  onClick, 
  isLoading, 
  tooltip = 'Làm mới dữ liệu' 
}) => {
  return (
    <div >   
    <Tooltip title={tooltip}>
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={onClick}
        loading={isLoading}
        style={{ marginRight: 8 }}
      >
        Làm mới
      </Button>
    </Tooltip>
    </div>
  );
};

export default RefreshButton; 