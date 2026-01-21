package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.Subject;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SubjectMapper extends BaseMapper<Subject> {
}
