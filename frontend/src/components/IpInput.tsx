import React, { useRef } from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import { processIpSegmentValue, shouldJumpToNext } from '../utils/ipUtils';

interface IpInputProps {
  ipSegments: string[];
  onIpSegmentsChange: (segments: string[]) => void;
  className?: string;
}

/**
 * IP地址输入组件
 */
const IpInput: React.FC<IpInputProps> = ({ ipSegments, onIpSegmentsChange, className }) => {
  // 创建输入框的引用
  const inputRefs = useRef<(InputRef | null)[]>([]);

  // 处理IP段输入变化
  const handleIpSegmentChange = (index: number, value: string) => {
    const segmentValue = processIpSegmentValue(value);
    
    const newSegments = [...ipSegments];
    newSegments[index] = segmentValue;
    onIpSegmentsChange(newSegments);
    
    // 如果输入了点号或者当前段已经是3位数，自动跳到下一个输入框
    if (shouldJumpToNext(value, segmentValue) && index < 3) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        // 自动选中所有文本
        setTimeout(() => {
          nextInput.select();
        }, 0);
      }
    }
  };

  // 处理键盘事件
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按下Enter键时跳到下一个输入框
    if (e.key === 'Enter' && index < 3) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        // 自动选中所有文本
        setTimeout(() => {
          nextInput.select();
        }, 0);
      }
    }
    // 按下点号时跳到下一个输入框
    else if (e.key === '.' && index < 3) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        // 自动选中所有文本
        setTimeout(() => {
          nextInput.select();
        }, 0);
      }
    }
    // 按下退格键且当前输入框为空时，跳到上一个输入框
    else if (e.key === 'Backspace' && ipSegments[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div 
      className={`ip-input-container ${className || ''}`}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'nowrap'
      }}
    >
      {ipSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <Input
            ref={(el) => { inputRefs.current[index] = el; }}
            value={segment}
            onChange={(e) => handleIpSegmentChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder="0"
            size="large"
            style={{ 
              width: '60px', 
              textAlign: 'center',
              fontSize: '16px',
              borderRadius: '8px'
            }}
            maxLength={3}
          />
          {index < 3 && (
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#666' }}>.</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default IpInput;