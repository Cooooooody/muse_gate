package com.musegate.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.musegate.domain.BankTransfer;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BankTransferMapper extends BaseMapper<BankTransfer> {
}
