#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix double-encoded UTF-8 in SPRING_BOOT_CONVERSATIONS.md
The text appears to be UTF-8 that was double-encoded
"""

import sys
import codecs

def fix_double_encoding(input_file, output_file):
    """
    Fix text that was UTF-8 encoded twice
    """
    try:
        # Read file normally (it's probably already UTF-8 or latin-1)
        with open(input_file, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
        
        # Common Vietnamese double-encoding patterns to fix
        replacements = {
            'táº¡o': 'tạo',
            'quáº£n': 'quản',
            'lÃ½': 'lý',
            'vÃ ': 'và ',
            'vÃ\xa0': 'và ',
            'cáº£': 'cả',
            'ngÆ°á»i': 'người',
            'ngưọi': 'người',
            'dÃ¹ng': 'dùng',
            'Äáº§u': 'đầu',
            'Äá»nh': 'định',
            'Äá»©c': 'được',
            'Äá»': 'để',
            'cÃ³': 'có',
            'lÃ ': 'là ',
            'má»t': 'một',
            'cá»§a': 'của',
            'nhÆ°': 'như',
            'Äiá»u': 'điều',
            'khiá»n': 'khiển',
            'thÃªm': 'thêm',
            'sá»­a': 'sửa',
            'xÃ³a': 'xóa',
            'tÃ¬m': 'tìm',
            'kiáº¿m': 'kiếm',
            'dá»¯': 'dữ',
            'liá»u': 'liệu',
            'Äang': 'đang',
            'sá»­': 'sử',
            'dá»¥ng': 'dụng',
            'thá»­': 'thử',
            'ná»i': 'nội',
            'tráº£': 'trả',
            'vá»': 'về',
            'hiá»n': 'hiện',
            'thá»±c': 'thực',
            'chá»©c': 'chức',
            'nÄng': 'năng',
            'trÃªn': 'trên',
            'á»©ng': 'ứng',
            'Æ°': 'ư',
            'á»': 'ờ',
            'á»›': 'ở',
            'á»': 'ớ',
            'á»£': 'ợ',
            'Ã¡': 'á',
            'Ã ': 'à',
            'áº£': 'ả',
            'Ã£': 'ã',
            'áº¡': 'ạ',
            'Ã©': 'é',
            'Ã¨': 'è',
            'áº»': 'ẻ',
            'áº½': 'ẽ',
            'áº¹': 'ẹ',
            'Ã­': 'í',
            'Ã¬': 'ì',
            'á»': 'ỉ',
            'Ä©': 'ĩ',
            'á»': 'ị',
            'Ã³': 'ó',
            'Ã²': 'ò',
            'á»': 'ỏ',
            'Ãµ': 'õ',
            'á»': 'ọ',
            'Ãº': 'ú',
            'Ã¹': 'ù',
            'á»§': 'ủ',
            'Å©': 'ũ',
            'á»¥': 'ụ',
            'Ã½': 'ý',
            'á»³': 'ỳ',
            'á»·': 'ỷ',
            'á»¹': 'ỵ',
            'Ä': 'đ',
            'ẹ': 'ẹ',
            'ọ': 'ọ',
            'ị': 'ị',
            'ụ': 'ụ',
        }
        
        fixed_content = content
        for old, new in replacements.items():
            fixed_content = fixed_content.replace(old, new)
        
        # Write back
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        # Count replacements
        total_fixes = sum(content.count(old) for old in replacements.keys())
        
        print(f"✓ Successfully fixed {total_fixes} encoding issues!")
        print(f"  Input:  {input_file}")
        print(f"  Output: {output_file}")
        return True
        
    except Exception as e:
        print(f"✗ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    input_path = "SPRING_BOOT_CONVERSATIONS.md"
    output_path = "SPRING_BOOT_CONVERSATIONS_fixed.md"
    
    if fix_double_encoding(input_path, output_path):
        print("\nPreview of fixes (first occurrence):")
        print("  táº¡o → tạo")
        print("  quáº£n lÃ½ → quản lý")
        print("  ngÆ°á»i dÃ¹ng → người dùng")
        print(f"\nReview the file and if correct:")
        print(f"  Move-Item -Force SPRING_BOOT_CONVERSATIONS_fixed.md SPRING_BOOT_CONVERSATIONS.md")
    else:
        sys.exit(1)
